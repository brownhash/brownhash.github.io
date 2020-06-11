function get_ids() {
    var allElements = document.getElementsByTagName("*");
    var allIds = [];
    for (var i = 0, n = allElements.length; i < n; ++i) {
        var el = allElements[i];
        if (el.id) { allIds.push(el.id); }
    }
    return allIds;
}

function id_finder(keyword) {
    var ids = get_ids();

    if (keyword.length > 2) {

        for (var i = 0; i < ids.length; i++) {
            var id = ids[i].toString();

            for (var j=0; j < keyword.toString().split(" ").length; j++) {

                var key = keyword.toString().split(" ")[j];

                if (key.length > 1) {
                    if (id.includes(key.toString())) {
                        var element = document.getElementById(id);
                        element.classList.remove("hidden");
                    }
                    else {
                        var element = document.getElementById(id);
                        if (id !== "search_bar") {
                            element.classList.add("hidden");
                        }
                    }
                }
            }
        }
    }
}

function search() {
    var x = document.getElementById("search_bar");
    id_finder(x.value);
}