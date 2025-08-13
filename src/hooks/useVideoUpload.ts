import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

interface UploadProgress {
  progress: number;
  status: 'idle' | 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
}

export function useVideoUpload() {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    progress: 0,
    status: 'idle'
  });

  const uploadVideo = async (
    file: File,
    metadata: {
      title: string;
      description: string;
      category: string;
      ageGroup: string;
      status: 'draft' | 'published';
    }
  ) => {
    try {
      setUploadProgress({ progress: 0, status: 'uploading' });

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `videos/${fileName}`;

      // Upload video file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('videos')
        .upload(filePath, file, {
          onUploadProgress: (progress) => {
            const percentage = (progress.loaded / progress.total) * 100;
            setUploadProgress({ progress: percentage, status: 'uploading' });
          }
        });

      if (uploadError) throw uploadError;

      setUploadProgress({ progress: 100, status: 'processing' });

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(filePath);

      // Generate thumbnail (placeholder for now)
      const thumbnailUrl = `https://via.placeholder.com/320x180/3B82F6/FFFFFF?text=${encodeURIComponent(metadata.title)}`;

      // Save video metadata to database
      const { data: videoData, error: dbError } = await supabase
        .from('videos')
        .insert({
          title: metadata.title,
          description: metadata.description,
          category: metadata.category,
          age_group: metadata.ageGroup,
          file_url: publicUrl,
          thumbnail_url: thumbnailUrl,
          status: metadata.status,
          duration: 0, // Will be updated after processing
          views: 0
        })
        .select()
        .single();

      if (dbError) throw dbError;

      setUploadProgress({ progress: 100, status: 'completed' });
      return videoData;

    } catch (error) {
      console.error('Upload error:', error);
      setUploadProgress({ 
        progress: 0, 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Upload failed' 
      });
      throw error;
    }
  };

  const resetUpload = () => {
    setUploadProgress({ progress: 0, status: 'idle' });
  };

  return {
    uploadVideo,
    uploadProgress,
    resetUpload
  };
}