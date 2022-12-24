import { useEffect } from 'react';

export const useDocumentTitle = (title: string) => {
  useEffect(() => {
    document.title = title;
  }, [title]);
};

export const useMetaDescription = (description: string) => {
  useEffect(() => {
    const descriptionEl = document.getElementById('meta-description');
    descriptionEl?.setAttribute('content', description);
  }, [description]);
};
