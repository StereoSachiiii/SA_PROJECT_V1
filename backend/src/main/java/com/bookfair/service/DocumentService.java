package com.bookfair.service;

import com.bookfair.entity.Document;
import com.bookfair.entity.User;
import com.bookfair.repository.DocumentRepository;
import com.bookfair.exception.ResourceNotFoundException;
import org.springframework.security.access.AccessDeniedException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.StringUtils;
import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@lombok.extern.slf4j.Slf4j
public class DocumentService {

    private final DocumentRepository documentRepository;
    
    @org.springframework.beans.factory.annotation.Value("${file.upload-dir:uploads/}")
    private String uploadDir;

    public Document uploadDocument(User uploader, MultipartFile file) {
        try {
            // Ensure directory exists
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generate unique filename to prevent collisions
            String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
            String uniqueFilename = UUID.randomUUID() + "_" + originalFilename;
            Path filePath = uploadPath.resolve(uniqueFilename);

            // Save file locally
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Save metadata to DB
            Document document = Document.builder()
                    .uploader(uploader)
                    .fileName(originalFilename)
                    .fileType(file.getContentType())
                    .storagePath(filePath.toString())
                    .sizeBytes(file.getSize())
                    .build();

            return documentRepository.save(document);

        } catch (IOException e) {
            throw new RuntimeException("Could not store file " + file.getOriginalFilename() + ". Please try again!", e);
        }
    }

    public List<Document> getUserDocuments(User user) {
        return documentRepository.findByUploaderId(user.getId());
    }

    public Document getDocument(Long id, User requestor) {
        Document doc = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found"));
        
        // Access control: Only uploader or Admin can view
        if (!doc.getUploader().getId().equals(requestor.getId()) && 
            requestor.getRole() != User.Role.ADMIN && requestor.getRole() != User.Role.EMPLOYEE) {
            throw new AccessDeniedException("Unauthorized access to document");
        }
        return doc;
    }

    public void deleteDocument(Long id, User requestor) {
        Document doc = getDocument(id, requestor);
        
        try {
            Path filePath = Paths.get(doc.getStoragePath());
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            // Log but continue to delete DB record
            log.error("Failed to delete physical file: {}", e.getMessage());
        }
        
        documentRepository.delete(doc);
    }
}
