let page = {
    onHashChange()
    {
        let hash = location.hash.replace(/^#!\//, "");
        let parts = hash.split("/");
        this.navigate(parts);
    },

    async navigate(urlParts)
    {
        let pageContent = document.getElementById("page-content");
        let spinner = document.getElementById("spinner");

        pageContent.innerHTML = "";
        spinner.hidden = false;

        let template = "404";
        let data = {};
        switch (urlParts[0])
        {
            case "":
                template = "home";
                break;
            case "download":
            {
                template = "download";
                let r = await fetch("https://api.github.com/repos/aubymori/OpenWithEx/releases"); // debug
                if (r.status != 200)
                    break;

                let json;
                try
                {
                    json = await r.json();
                } catch (e) { break; }

                data.releases = [];
                for (const release of json)
                {
                    let rdata = {};
                    rdata.name = release.name;
                    rdata.url = release.html_url;
                    rdata.date =
                        new Date(release.published_at).toLocaleDateString(
                            "ja-JP",
                            {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit"
                            }
                        );
                    for (const asset of release.assets)
                    {
                        if (asset.name == "OpenWithEx-setup-x64.exe")
                        {
                            rdata.download_x64 = asset.browser_download_url;
                        }
                    }
                    data.releases.push(rdata);
                }

                break;
            }
            case "packs":
            {
                template = "packs";
                let packs = await (await fetch("data/packs.json")).json();
                data.packs = packs;
                break;
            }
            case "pack":
            {
                let id = urlParts[1];
                if (id === "" || id === undefined)
                    break;

                let r = await fetch(`data/${id}/pack.json`);
                if (r.status != 200)
                    break;

                let json;
                try
                {
                    json = await r.json();
                } catch (e) { break; }

                data.pack = json;
                template = "pack";
                break;
            }
        }

        pageContent.innerHTML = nunjucks.render(template + ".html", data);
        spinner.hidden = true;
    },

    init()
    {
        nunjucks.configure("templates", {
            web: { useCache: true }
        });
        window.addEventListener("hashchange", this.onHashChange.bind(this));
        this.onHashChange();
    }
};

page.init();