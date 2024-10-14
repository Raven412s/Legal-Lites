"use client";

import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { Progress } from "@/components/ui/progress";

interface ImageUploaderProps {
  onUpload: (url: string) => void; // Callback function to return the uploaded image URL
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onUpload }) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [dragActive, setDragActive] = useState<boolean>(false); // For drag-and-drop visuals

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setIsDialogOpen(true);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files?.[0] || null;
    if (droppedFile) {
      setFile(droppedFile);
      setPreviewUrl(URL.createObjectURL(droppedFile));
      setIsDialogOpen(true);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "oa0ztxjo"); // Replace with your Cloudinary preset

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dzynl3hzk/image/upload", // Replace with your Cloudinary URL
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total!
            );
            setProgress(percentCompleted);
          },
        }
      );

      const imageUrl = response.data.secure_url;
      onUpload(imageUrl); // Call the parent function with the uploaded image URL
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium leading-6 text-gray-900 mb-2">Upload Documents</label>
      <div
        className={`border-2 border-dashed card-shadow p-4 rounded-lg ${dragActive ? 'border-blue-500 bg-blue-100' : 'border-gray-300'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="image-uploader-input"
        />
        <label htmlFor="image-uploader-input" className="flex flex-col items-center cursor-pointer">
          <div className="flex flex-col gap-2 justify-center items-center " ><span className="text-gray-500">Drag and drop or click to </span><span className="px-2 py-1 rounded card-shadow w-max bg-green-400/80 text-white">upload image</span></div>
        </label>
      </div>

      {previewUrl && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="h-[90%] overflow-scroll ">
            <DialogHeader>
              <DialogTitle>Upload Image Preview</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center">
              <img src={previewUrl} alt="Preview" className="max-w-full h-auto rounded-md" />
              <Badge className="mt-4">{file?.name}</Badge>
                <div className="flex w-full justify-between items-center mt-4">
                <Button
                className="mt-4 bg-success card-shadow"
                onClick={handleUpload}
                disabled={uploading}
                variant={"default"}
              >
                {uploading ? "Uploading..." : "Confirm Upload"}
              </Button>
                <Button
                className="mt-4 card-shadow"
                onClick={handleUpload}
                disabled={uploading}
                variant={"outline"}
              >
               cancel
              </Button>
                </div>

              {uploading && (
                <Progress
                  value={progress}
                  className="mt-4 w-full"
                  max={100}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ImageUploader;
