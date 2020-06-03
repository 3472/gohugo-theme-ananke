document.addEventListener("DOMContentLoaded", function () {
    let searchResults = [];
    let searchIndex = null;
    let searchContent = null;
    const searchButton = document.getElementById("search-button");
    searchButton.addEventListener("click", search);

    fetch("/contents")
        .then(res => res.json())
        .then(content => {
            searchContent = content;
            searchIndex = lunr(function () {
                this.ref("id")
                this.field("content");
                this.field("tag");
                this.field("title");
                this.field("url");
                this.field("type");
                Array.from(content).forEach(doc => {
                    this.add(doc);
                }, this);
            });
        })
        .catch(function (error) {
            console.error(error);
        });


    function search() {
        const searchResultElement = document.getElementById("search-results");
        const searchInput = document.getElementById("search-input");
        let searchString = searchInput.value;
        if (searchString && searchString.length > 2) {
            try {
                searchResults = searchIndex.search(searchString);
            } catch (err) {
                console.log(err);
                if (err instanceof lunr.QueryParseError) {
                    return;
                }
            }
        } else {
            searchResults = [];
        }
        if (searchResults.length > 0) {
            searchResultElement.innerHTML = searchResults.map(match => {
                let item = searchContent.find(function (e) {
                    return e.id == parseInt(match.ref);
                });
                return (`<li  style="display:list-item"> <a href="${item.url}">${item.title}</a> </li>`);


                // "<h4 title='field: title'><a href='" + item.url + "'>" + mark(item.title, searchString) + "</a></h4>" +
                // "<p class='type'>" + item.type + "</p>" +
                // "<p class='summary' title='field: content'>" +
                // "</p>" +
                // "<p class='tags' title='field: tag'>" + tags(item.tag, searchString) + "</p>" +
                // "<a href='" + item.url + "' title='field: url'>" + mark(item.url, searchString) + "</a>" +
                // "</li>";
            }).join("");
        } else {
            searchResultElement.innerHTML = "<li><p>No results found</p></li>";
        }
    }
});