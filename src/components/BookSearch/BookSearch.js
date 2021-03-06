import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import BookSearchResult from '../BookSearchResult/BookSearchResult';
import './BookSearch.scss';
import 'firebase/auth';

class BookSearch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchInput: '',
      writtenInput: '',
    };

    this.bookSearch = this.bookSearch.bind(this);
    this.inputBook = this.inputBook.bind(this);
    this.debouncedKeyPress = debounce(this.debouncedKeyPress.bind(this), 300);
    this.enterKeyPress = this.enterKeyPress.bind(this);
    this.searchKeyword = this.searchKeyword.bind(this);
    this.writingBookTitle = this.writingBookTitle.bind(this);
  }

  bookSearch() {
    const { searchInput } = this.state;
    const { searchBtnClick, books } = this.props;

    if (books.keyword !== searchInput) {
      const isNewKeyword = true;
      searchBtnClick(searchInput, 1, isNewKeyword);
    }
  }

  debouncedKeyPress(key, input) {
    if (key === 'Enter') {
      if (input.includes('search')) {
        this.bookSearch();
      } else {
        this.inputBook();
      }
    }
  }

  enterKeyPress(ev) {
    this.debouncedKeyPress(ev.key, ev.target.className);
  }

  inputBook() {
    const {
      bookClick,
      history,
    } = this.props;
    const { writtenInput } = this.state;

    if (writtenInput.length) {
      bookClick(null, writtenInput, null, null);
      history.push('/memo');
    } else {
      window.alert('반드시 제목을 입력해주셔야 합니다. :)');
    }
  }

  searchKeyword(ev) {
    const keyword = ev.target.value;

    this.setState({
      searchInput: keyword,
    });
  }

  writingBookTitle(ev) {
    const input = ev.target.value;

    this.setState({
      writtenInput: input,
    });
  }

  render() {
    const {
      searchBtnClick,
      books,
      bookClick,
      history,
    } = this.props;
    const { isLastSearchPage, page, keyword } = books;

    return (
      <div className="bookSearch userInputContainer">
        <div className="notice">Book Search</div>
        <div className="searchBox box">
          <input
            placeholder="책 검색"
            className="search userInput"
            onChange={this.searchKeyword}
            onKeyPress={this.enterKeyPress}
          />
          <button className="greenbtn" type="submit" onClick={this.bookSearch}>search</button>
        </div>
        <div className="userInputBox box">
          <input
            placeholder="책 제목 직접 입력"
            className="userInput userInput"
            onChange={this.writingBookTitle}
            onKeyPress={this.enterKeyPress}
          />
          <button className="greenbtn" type="submit" onClick={this.inputBook}>submit</button>
        </div>
        <BookSearchResult
          history={history}
          books={books.books}
          bookClick={bookClick}
          page={page}
          keyword={keyword}
          searchStop={isLastSearchPage}
          keepSearch={searchBtnClick}
        />
      </div>
    );
  }
}

export default BookSearch;

BookSearch.propTypes = {
  searchBtnClick: PropTypes.func,
  books: PropTypes.shape({
    keyword: PropTypes.string,
  }),
  bookClick: PropTypes.func,
  getSelectedMemos: PropTypes.func,
  history: PropTypes.object,
};
