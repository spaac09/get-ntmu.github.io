function sort(sort)
{
    let sortFn = null;
    switch (sort)
    {
        case "new":
            sortFn = (a, b) => {
                let dateA = new Date(a.dataset.date);
                let dateB = new Date(b.dataset.date);
                return dateB.getTime() - dateA.getTime();
            };
            break;
        case "old":
            sortFn = (a, b) => {
                let dateA = new Date(a.dataset.date);
                let dateB = new Date(b.dataset.date);
                return dateA.getTime() - dateB.getTime();
            };
            break;
        case "az":
            sortFn = (a, b) => {
                let titleA = a.querySelector(".pack-title").textContent.toLowerCase();
                let titleB = b.querySelector(".pack-title").textContent.toLowerCase();
                if (titleA < titleB)
                    return -1;
                if (titleA > titleB)
                    return 1;
                return 0;
            };
            break;
        case "za":
            sortFn = (a, b) => {
                let titleA = a.querySelector(".pack-title").textContent.toLowerCase();
                let titleB = b.querySelector(".pack-title").textContent.toLowerCase();
                if (titleA < titleB)
                    return 1;
                if (titleA > titleB)
                    return -1;
                return 0;
            };
            break;
    }

    let content = document.getElementById("packs-content");
    let packs = Array.from(content.querySelectorAll(".pack"));
    packs.sort(sortFn);

    for (const pack of packs)
    {
        content.insertAdjacentElement("beforeend", pack);
    }
}

document.addEventListener("click", e => {
    if (e.target.id == "pack-search-submit")
    {
        let query = document.getElementById("pack-search-input").value.toLowerCase();
        for (const pack of document.querySelectorAll("#packs-content > .pack"))
        {
            pack.hidden =
                (pack.querySelector(".pack-title").textContent.toLowerCase().indexOf(query) == -1);
        }
    }
    else if (e.target.classList.contains("filter-link"))
    {
        let sel = document.querySelector(".filter-link.selected")
        if (sel)
            sel.classList.remove("selected");
        e.target.classList.add("selected");
        sort(e.target.dataset.value);
    }
});

async function waitForElement(query)
{
    while (document.querySelector(query) == null)
        await new Promise (r => requestAnimationFrame(r));
    return document.querySelector(query);
}

waitForElement(`.filter-link[data-value="new"]`).then(e => {
    e.classList.add("selected");
    sort("new");
})