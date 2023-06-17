import { useState, useEffect } from 'react';
import { map } from '../utils/map';
import { fetchApi } from '../services/api';
import { ButtonLoad } from './Button/Button';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Loader } from './Loader/Loader';
import { Searchbar } from './Searchbar/Searchbar';
import { Notification } from './Notification/Notification';
import { Modal } from './Modal/Modal';

export const App = () => {
  const imgPerPage = 12;
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageInModal, setImageInModal] = useState(null);
  const [imagesQuantity, setImagesQuantity] = useState(null);

  useEffect(() => {
    if (query === '') {
      return;
    }
    fetchImg(query, page, imgPerPage);
  }, [query, page]);

  const fetchImg = async (query, page, imgPerPage) => {
    setNotFound(false);
    setError(null);
    setIsLoading(true);
    try {
      const data = await fetchApi(query, page, imgPerPage);
      const apiImages = data.hits;
      const totalHits = data.totalHits;
      if (apiImages.length) {
        setImages(prevState => [...prevState, ...map(apiImages)]);
        setNotFound(false);
        setImagesQuantity(totalHits);
      } else {
        setImages([]);
        setNotFound(true);
        setImagesQuantity(null);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = query => {
    setImages([]);
    setQuery(query);
    setPage(1);
  };

  const nextPage = () => {
    setPage(prevState => prevState + 1);
  };

  const openModal = e => {
    const imageInModal = e.target.dataset.url;
    setImageInModal(imageInModal);
  };

  const closeModal = () => {
    setImageInModal(null);
  };

  return (
    <>
      <Searchbar onSubmit={onSubmit} />
      {isLoading && <Loader />}
      {error && <Notification message={error} />}
      {notFound && !error && (
        <Notification message={'Nothing found for your request'} />
      )}
      {<ImageGallery images={images} openModal={openModal} />}
      {page < imagesQuantity / imgPerPage && !isLoading && !error && (
        <ButtonLoad nextPage={nextPage} />
      )}
      {imageInModal && <Modal url={imageInModal} closeModal={closeModal} />}
    </>
  );
};
