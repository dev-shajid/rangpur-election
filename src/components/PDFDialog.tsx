import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

export default function PDFDialog({driveFileId}: {driveFileId: string}) {
    const previewUrl = `https://drive.google.com/file/d/${driveFileId}/preview`
    
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    size="sm"
                    variant="outline"
                >
                    View
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl w-full max-h-[90vh] h-full">
                <DialogTitle className="sr-only">File Preview</DialogTitle>
                <iframe
                    src={previewUrl}
                    className="w-full h-full"
                    allow="autoplay"
                    title="File Preview"
                />
            </DialogContent>
        </Dialog>
    )
}