//clear img-list (photo-card)
export function clearGallery(refs) {
  const children = Array.from(refs.gallery.children);

  children.forEach(child => {
    refs.gallery.removeChild(child);
  });
}
