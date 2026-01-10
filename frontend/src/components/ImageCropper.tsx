import { useState, useCallback } from 'react';
import Cropper, { type Area } from 'react-easy-crop';
import { getCroppedImg } from '../utils/canvasUtils';
import { Upload, X, Loader2 } from 'lucide-react';

interface ImageCropperProps {
    image?: string;
    aspectRatio?: number;
    onCropComplete: (file: Blob) => void;
    label?: string;
    circularCrop?: boolean;
}

export default function ImageCropper({
    image,
    aspectRatio = 1,
    onCropComplete,
    label = "Upload Image",
    circularCrop = false
}: ImageCropperProps) {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [isCropping, setIsCropping] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setImageSrc(reader.result?.toString() || '');
                setIsCropping(true);
            });
            reader.readAsDataURL(file);
        }
    };

    const handleCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const processCrop = async () => {
        if (!imageSrc || !croppedAreaPixels) return;

        try {
            setIsProcessing(true);
            // Get base64 cropped image
            const croppedImageBase64 = await getCroppedImg(imageSrc, croppedAreaPixels);

            if (croppedImageBase64) {
                // Convert base64 to blob
                const response = await fetch(croppedImageBase64);
                const blob = await response.blob();
                onCropComplete(blob);
                setImageSrc(null);
                setIsCropping(false);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsProcessing(false);
        }
    };

    if (isCropping) {
        return (
            <div className="relative h-64 w-full bg-slate-900 rounded-lg overflow-hidden">
                <Cropper
                    image={imageSrc || ''}
                    crop={crop}
                    zoom={zoom}
                    aspect={aspectRatio}
                    onCropChange={setCrop}
                    onCropComplete={handleCropComplete}
                    onZoomChange={setZoom}
                    cropShape={circularCrop ? 'round' : 'rect'}
                />
                <div className="absolute bottom-4 right-4 flex gap-2">
                    <button
                        type="button"
                        onClick={() => { setIsCropping(false); setImageSrc(null); }}
                        className="bg-white text-slate-900 px-4 py-2 rounded-lg font-semibold shadow-lg hover:bg-slate-100"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={processCrop}
                        disabled={isProcessing}
                        className="bg-[#00ffd5] text-slate-900 px-4 py-2 rounded-lg font-semibold shadow-lg hover:bg-[#00e6c0] flex items-center gap-2"
                    >
                        {isProcessing && <Loader2 size={16} className="animate-spin" />}
                        Apply
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-4">
            <div className={`w-24 h-24 bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden relative group cursor-pointer hover:border-[#00ffd5] transition-colors ${circularCrop ? 'rounded-full' : 'rounded-lg'}`}>
                {image ? (
                    <img src={image} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                    <Upload size={24} className="text-slate-400 group-hover:text-[#00ffd5] transition-colors" />
                )}
                <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
            <div className="text-sm text-slate-500">
                <p className="font-medium text-slate-700">{label}</p>
                <p className="text-xs">Click to upload. Supports JPG, PNG.</p>
            </div>
        </div>
    );
}
