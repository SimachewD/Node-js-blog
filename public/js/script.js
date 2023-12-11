document.addEventListener('DOMContentLoaded', function(){
    const SearchButton = document.querySelector('.search__button');
    const searchBar = document.querySelector('.searchBar');
    const searchInput = document.getElementById('searchInput');
    const searchClose = document.getElementById('searchClose');

    // for (let i = 0; index < allButton.length; i++) {
        
    // }
    SearchButton.addEventListener('click', function() {
        searchBar.style.visibility = 'visible';
        searchBar.classList.add('open');
        this.setAttribute('aria-expanded', true);
        searchInput.focus();
    });

    searchClose.addEventListener('click', function() {
        searchBar.style.visibility = 'hidden';
        searchBar.classList.remove('open');
        this.setAttribute('aria-expanded', false);
        // searchInput.focus(); 
    });

});