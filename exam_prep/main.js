function get_ids() {
    let allElements = document.getElementsByTagName("*");
    let allIds = [];
    for (let i = 0, n = allElements.length; i < n; ++i) {
        let el = allElements[i];
        if (el.id) { allIds.push(el.id); }
    }
    return allIds;
}

function id_finder(keyword) {
    let ids = get_ids();

    if (keyword.length > 2) {

        for (let i = 0; i < ids.length; i++) {
            let id = ids[i].toString();

            for (let j=0; j < keyword.toString().split(" ").length; j++) {

                let key = keyword.toString().split(" ")[j];

                if (key.length > 1) {
                    if (id.includes(key.toString())) {
                        let element = document.getElementById(id);
                        element.classList.remove("hidden");
                    }
                    else {
                        let element = document.getElementById(id);
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
    let x = document.getElementById("search_bar");
    id_finder(x.value.toLowerCase());
}