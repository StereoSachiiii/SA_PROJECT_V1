package com.bookfair.controller;

import com.bookfair.entity.Document;
import com.bookfair.entity.User;
import com.bookfair.service.DocumentService;
import com.bookfair.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService documentService;
    private final UserService userService;

    @PostMapping("/upload")
    public ResponseEntity<com.bookfair.dto.response.DocumentResponse> uploadFile(@RequestParam("file") MultipartFile file, Principal principal) {
        User uploader = userService.getByUsernameForServices(principal.getName());
        Document doc = documentService.uploadDocument(uploader, file);
        
        return ResponseEntity.ok(com.bookfair.dto.response.DocumentResponse.builder()
                .id(doc.getId())
                .fileName(doc.getFileName())
                .fileSize(doc.getSizeBytes())
                .uploadDate(doc.getUploadedAt())
                .build());
    }

    @GetMapping
    public ResponseEntity<List<com.bookfair.dto.response.DocumentResponse>> getMyDocuments(Principal principal) {
        User user = userService.getByUsernameForServices(principal.getName());
        List<com.bookfair.dto.response.DocumentResponse> docs = documentService.getUserDocuments(user).stream()
            .map(d -> com.bookfair.dto.response.DocumentResponse.builder()
                .id(d.getId())
                .fileName(d.getFileName())
                .fileSize(d.getSizeBytes())
                .uploadDate(d.getUploadedAt())
                .build())
            .collect(Collectors.toList());
            
        return ResponseEntity.ok(docs);
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long id, Principal principal) {
        User requestor = userService.getByUsernameForServices(principal.getName());
        Document doc = documentService.getDocument(id, requestor);

        try {
            Path filePath = Paths.get(doc.getStoragePath());
            Resource resource = new UrlResource(filePath.toUri());

            if(resource.exists() || resource.isReadable()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(doc.getFileType() != null ? doc.getFileType() : "application/octet-stream"))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + doc.getFileName() + "\"")
                        .body(resource);
            } else {
                throw new com.bookfair.exception.ResourceNotFoundException("Could not read file: " + doc.getFileName());
            }
        } catch (MalformedURLException e) {
            throw new com.bookfair.exception.BadRequestException("Error: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDocument(@PathVariable Long id, Principal principal) {
        User requestor = userService.getByUsernameForServices(principal.getName());
        documentService.deleteDocument(id, requestor);
        return ResponseEntity.noContent().build();
    }
}
