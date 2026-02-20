export interface Stall {
    id: number
    name: string
    size: 'SMALL' | 'MEDIUM' | 'LARGE'
    priceCents?: number
    width?: number
    height?: number
    reserved: boolean
    occupiedBy?: string
    positionX: number
    positionY: number
    colSpan?: number
    rowSpan?: number
}
