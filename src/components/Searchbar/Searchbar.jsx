import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Searchbox,
  SearchForm,
  SearchFormBtn,
  SearchFormInput,
} from './SearchBar.styled';
import Notiflix from 'notiflix';

export const Searchbar = ({ onSubmit }) => {
  const [query, setQuery] = useState('');

  const searchInput = ({ target: { value } }) => {
    setQuery(value.toLowerCase());
  };

  const onFormSubmit = e => {
    e.preventDefault();
    if (query.trim() === '') {
      return Notiflix.Notify.info(
        'Enter the name of the category of images you want to search'
      );
    }
    onSubmit(query);
    setQuery('');
  };

  return (
    <Searchbox>
      <SearchForm onSubmit={e => onFormSubmit(e)}>
        <SearchFormBtn type="submit">Search</SearchFormBtn>
        <SearchFormInput
          type="text"
          name="query"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
          onChange={searchInput}
        />
      </SearchForm>
    </Searchbox>
  );
};

Searchbar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
