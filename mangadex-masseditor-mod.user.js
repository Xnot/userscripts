// ==UserScript==
// @name         MangaDex Mass Editor v2 (definitely not) Beta
// @namespace    https://github.com/Xnot/userscripts
// @version      2.02
// @icon         https://mangadex.org/images/misc/default_brand.png?1
// @description  mass edit script but it doesn't make me want to kill myself when I look at the code
// @author       Xnot
// @updateURL    https://github.com/Xnot/userscripts/raw/master/mangadex-masseditor-mod.user.js
// @downloadURL  https://github.com/Xnot/userscripts/raw/master/mangadex-masseditor-mod.user.js
// @include      /.*mangadex\.org/(title|group|user)/([0-9]*?)/([^/]*)/?((chapters|mod_chapters|deleted)/?)?([0-9]*/?)$
// @grant        none
// ==/UserScript==

function createInfoBox(){
    const infoBox = document.createElement("div");
    infoBox.classList.add("alert", "alert-info", "col-12");
    infoBox.setAttribute("role", "alert");
    infoBox.innerHTML =
        `
        <h6>MangaDex Mass Editor Script v${GM_info.script.version}</h6>
        <ul>
            <li>Use the 'to edit' fields to filter chapters. Each line is one value.
            <li>Use an empty line for empty chapter titles/numbers/volumes and 0 for empty groups2/3.
            <li>Only chapters in the page you are looking at can be edited.
            <li>The 'new' fields determine the new values for the filtered chapters in whatever order they show up in.
            <li>Use a space to delete chapter titles/chapters/volumes, and 0 to delete groups2/3.
            <li>Inputting a single value will use that value for all chapters.
            <li>Use an empty line to skip a chapter or pretend a single value is not a single value.
            <li>The preview is objectively perfect now, so honestly it's pretty hard to fuck it up <s>unless the script is fucked</s>.
        </ul>
        <h6>Changelog:</h6>
        <ul>
            <li>Preview moved to the side.
            <li>Preview updates automatically.
            <li>Added manga id, files, and unavailable status to preview.
            <li>Languages are IDs now because I was lazy.
            <li>It has a delete button.
            <li>It works on group and user pages.
            <li>It no longer causes cancer.
        </ul>
        `;
    return infoBox;
}

function createEditField(name = "", collapsed = false){
    const arrowStart = collapsed ? "right" : "down";
    const toggleStart = collapsed ? "collapsed" : "";
    const fieldStart = collapsed ? "" : "show";
    const editField = document.createElement("div");
    editField.classList.add("form-group", "row");
    editField.innerHTML =
        `
        <a data-toggle="collapse" data-target="#mass_${name}" class="col-sm-2 ${toggleStart}">
            <label for="mass_${name}" class="control-label", style="text-transform: capitalize;">
                ${name.replace(/_/g, " ")}
                <span id=mass_${name}_arrow class="fas fa-angle-${arrowStart} fa-fw"></span>
            </label>
        </a>
        <div class="col-sm-10">
            <textarea id="mass_${name}" name="mass_${name}" placeholder="Entry 1\nEntry 2\nEntry 3" class="form-control collapse ${fieldStart}" style="height: 80px;"></textarea>
        </div>
        `;

    // change arrow and set correct height on expand/collapse
    const thisField = $(editField).find(`#mass_${name}`);
    const thisArrow = $(editField).find(`#mass_${name}_arrow`)[0];
    thisField.on("hidden.bs.collapse",
        function(){
                thisArrow.classList.replace("fa-angle-down", "fa-angle-right");
        });
    thisField.on("shown.bs.collapse",
        function(){
            thisArrow.classList.replace("fa-angle-right", "fa-angle-down");
            this.style.height = "80px";
        });
    // update preview whenever field is changed
    thisField.on("change keyup paste", updatePreview);

    return editField;
}

function createFileField(collapsed = false){
    const arrowStart = collapsed ? "right" : "down";
    const toggleStart = collapsed ? "collapsed" : "";
    const fieldStart = collapsed ? "" : "show";
    const editField = document.createElement("div");
    editField.classList.add("form-group", "row");
    editField.innerHTML =
        `
        <a data-toggle="collapse" data-target="#mass_new_file_container" class="col-sm-2 ${toggleStart}">
            <label class="control-label">
                New Files
                <span id="mass_new_file_arrow" class="fas fa-angle-${arrowStart} fa-fw"></span>
            </label>
        </a>
        <div class="col-sm-10 ${fieldStart}" id="mass_new_file_container" style="">
            <div class="input-group">
                <input id="mass_placeholder_new_file" class="form-control" type="text" placeholder="No files selected" disabled="true">
                    <span class="input-group-btn">
                        <span class="btn btn-default btn-file">
                            <span class="far fa-folder-open fa-fw" style="margin-right: 3px;"></span>
                            <span class="span-1280">
                                Browse
                            </span>
                            <input id="mass_new_file" type="file" name="file" multiple="true" accept=".zip,.cbz">
                        </span>
                    </span>
                </div>
            </div>
        </div>
        `

    // change arrow on expand/collapse
    const thisField = $(editField).find(`#mass_new_file_container`);
    const thisArrow = $(editField).find(`#mass_new_file_arrow`)[0];
    const thisFiles = $(editField).find(`#mass_new_file`)[0];
    const thisPlaceholder = $(editField).find(`#mass_placeholder_new_file`)[0];
    thisField.on("hidden.bs.collapse",
        function(){
            thisArrow.classList.replace("fa-angle-down", "fa-angle-right");
        });
    thisField.on("shown.bs.collapse",
        function(){
            thisArrow.classList.replace("fa-angle-right", "fa-angle-down");
        });
    // change text to show number of files selected and reverse file order
    thisField.on("change",
        function(){
            thisPlaceholder.setAttribute("placeholder", `${thisFiles.files.length} file(s) selected`);
            // why the fuck does FileList not inherit Array methods
            thisFiles.filesArray = Array.from(thisFiles.files).reverse();
        });
    thisFiles.filesArray = [];
    // update preview whenever field is changed
    thisField.on("change keyup paste", updatePreview);

    return editField
}

function createButton(name, icon, color, action){
    const button = document.createElement("button");
    button.setAttribute("id", `mass_${name}_button`);
    button.setAttribute("type", "button");
    button.classList.add("btn", "float-right", "mr-1", `btn-${color}`);
    button.style.position = "sticky";
    button.style.top = "75px";
    button.innerHTML =
        `
        <span class="fas fa-${icon} fa-fw " aria-hidden="true" title="${name}"></span>
        <span class="d-none d-xl-inline" style="text-transform: capitalize;">${name.replace(/_/g, " ")}</span>
        `;
    button.addEventListener("click", action);

    return button;
}

function createMassEditForm(page){
    // container for the form and the preview table
    const massEditContainer = document.createElement("div");
    massEditContainer.setAttribute("id", "mass_edit_container");
    massEditContainer.classList.add("row", "card-body");
    massEditContainer.style.display = "none";

    // information dialog
    massEditContainer.appendChild(createInfoBox());

    // form containing the edit fields
    const massEditForm = document.createElement("form");
    massEditForm.setAttribute("id", "mass_edit_form");
    massEditForm.classList.add("col-4");
    massEditContainer.appendChild(massEditForm);
    // create mass edit fields
    let editFields = [];
    if(page != "title"){
        editFields.push(["manga_id_to_edit", false])
    }
    if(page != "user"){
        editFields.push(["uploader_id_to_edit", false])
    }
    editFields.push(
        // ["manga_id_to_edit", false],
        // ["uploader_id_to_edit", false],
        ["chapter_title_to_edit", false],
        ["volume_number_to_edit", false],
        ["chapter_number_to_edit", false],
        ["language_id_to_edit", false],
        ["group_id_to_edit", false],
        ["group_2_id_to_edit", false],
        ["group_3_id_to_edit", false],
        ["availability_to_edit", false],
        ["new_uploader_id", false],
        ["new_chapter_title", false],
        ["new_volume_number", false],
        ["new_chapter_number", false],
        ["new_language_id", false],
        ["new_group_id", false],
        ["new_group_2_id", false,],
        ["new_group_3_id", false],
        ["new_manga_id", false],
        ["new_availability", false],
    );
    // parse field HTML and append
    for(const field of editFields){
        massEditForm.appendChild(createEditField(field[0], field[1]));
    }
    // file upload field
    massEditForm.appendChild(createFileField());
    // action buttons
    massEditForm.appendChild(createButton("apply", "check-double", "success", applyMassEdit));
    massEditForm.appendChild(createButton("delete", "dumpster-fire", "danger", applyMassDelete));
    massEditForm.appendChild(createButton("close", "window-close", "warning", toggleMassEditForm));

    // preview table
    massEditContainer.appendChild(createPreviewTable());

    return massEditContainer;
}

function createPreviewTable(){
    const editPreviewTable = document.createElement("table")
    editPreviewTable.setAttribute("id", "mass_preview_table");
    editPreviewTable.classList.add("col-8", "table-striped", "table-bordered");
    editPreviewTable.style.position = "sticky";
    editPreviewTable.style.top = "75px";
    editPreviewTable.innerHTML =
        `
        <thead>
            <tr>
                <th><span class="fas fa-book fa-fw " title="manga_id"></span></th>
                <th><span class="fas fa-volume-up fa-fw " title="volume_number"></span></th>
                <th><span class="fas fa-file-alt fa-fw " title="chapter_number"></span></th>
                <th><span class="fab fa-tumblr fa-fw " title="chapter_title"></span></th>
                <th><span class="fas fa-globe fa-fw " title="language_id"></span></th>
                <th><span class="fas fa-users fa-fw " title="group_id"></span></th>
                <th><span class="fas fa-users fa-fw " title="group2_id"></span></th>
                <th><span class="fas fa-users fa-fw " title="group3_id"></span></th>
                <th><span class="fas fa-user fa-fw " title="uploader"></span></th>
                <th><span class="fas fa-low-vision fa-fw " title="availability"></span></th>
                <th><span class="fas fa-upload fa-fw " title="file"></span></th>
            </tr>
        </thead>
        <tbody></tbody>
        `;
    return editPreviewTable;
}

// returns container in which massEditForm must be inserted
function getContainer(page){
    if(page === "group"){
        let container = document.getElementsByClassName("card mb-3")[5] || createGroupDescription();
        return container;
    }
    else{
        return document.getElementsByClassName("card mb-3")[0];
    }
}

// returns container in which openMassEditButton must be inserted
function getButtonContainer(page){
    if(page === "group"){
        let container = document.getElementsByClassName("card mb-3")[5] || createGroupDescription();
        return container.getElementsByClassName("card-body")[0];
    }
    else if(page === "title"){
        return document.getElementsByClassName("btn btn-info float-right")[0].parentNode;
    }
    else if(page === "user"){
        return Array.from(document.querySelectorAll("div[class='col-lg-3 col-xl-2 strong']")).find(el => el.textContent === 'Moderation:').nextElementSibling;
    }
}

function createGroupDescription(){
    const description = document.createElement("div");
    description.classList.add("card", "mb-3");
    description.innerHTML =
        `
                <h6 class="card-header">
                    <span class="fas fa-info-circle fa-fw " aria-hidden="true"></span> Description
                </h6>
                <div class="card-body"></div>
                `;

    document.getElementById("content").insertBefore(description, document.getElementsByClassName("edit nav nav-tabs")[0]);
    return description;
}

// toggles visibility between mass edit form and its previous sibling
function toggleMassEditForm(){
    const massEditForm = document.getElementById("mass_edit_container");
    massEditForm.previousElementSibling.style.display = massEditForm.previousElementSibling.style.display == "none" ? "block" : "none";
    massEditForm.style.display = massEditForm.style.display == "none" ? "flex" : "none";
}

// this is where I start regretting my life choices
function updatePreview(){
    const filterFields = document.getElementById("mass_edit_form").querySelectorAll("textarea[id^='mass_'][id$='_to_edit']");
    const alterFields = document.getElementById("mass_edit_form").querySelectorAll("textarea[id^='mass_new'], input[id^='mass_new']");

    let chapterList = filterChapters(parseChapterList(), parseFilters(filterFields));
    chapterList = parseAlterations(chapterList, alterFields);

    const previewTableBody = document.getElementById("mass_preview_table").getElementsByTagName("tbody")[0];
    previewTableBody.innerHTML = "";
    for(const chapter of chapterList){
        previewTableBody.appendChild(createChapter(chapter));
    }
}

//TODO:
// table should be dependent on the tab, for now mod is assumed
function getChapterTable(){
    return document.getElementsByClassName("tab-content")[0].getElementsByClassName("table table-striped table-hover table-sm")[0];
}

// returns a list of chapters with each element being a dict containing the chapter info
//TODO:
// parsing method should be dependent on the tab, for now mod is assumed
function parseChapterList(){
    // mod tab is parsed through the inline edit form
    const parsedChapters = new Map();
    const unparsedElements = [...getChapterTable().getElementsByTagName("tbody")[0].getElementsByTagName("tr")];
    while(unparsedElements.length > 0){
        // throw away the chapter element and get the inputs from the inline edit element
        unparsedElements.shift();
        const inlineEdit = unparsedElements.shift();
        const chapterID = inlineEdit.getElementsByClassName("btn btn-sm btn-danger mass_edit_delete_button")[0].id;
        const infoFields = inlineEdit.getElementsByTagName("input");
        parsedChapters.set(chapterID, {
            "manga_id": infoFields[0].value,
            "volume_number": infoFields[1].value,
            "chapter_number": infoFields[2].value,
            "chapter_title": infoFields[3].value,
            "language_id": infoFields[4].value,
            "group_id": infoFields[5].value,
            "group_2_id": infoFields[6].value,
            "group_3_id": infoFields[7].value,
            "uploader_id": infoFields[8].value,
            "availability": infoFields[9].checked ? "0" : "1",
            "file": "",
        });
    }
    return parsedChapters;
}

function parseFilters(fields){
    const filters = {};
    for(const field of fields){
        const name = field.id.replace("mass_", "").replace("_to_edit", "");
        const values = field.value.split("\n");
        // if field is empty, ignore filter
        if(!(values.length === 1 && values[0] === "")){
            filters[name] = values;
        }
    }
    return filters;
}

function filterChapters(chapters, filters){
    const filteredChapters = new Map();
    for(const [id, chapter] of chapters){
        let passesFilters = true;
        for(const [name, values] of Object.entries(filters)){
            if(!values.includes(chapter[name])){
                passesFilters = false;
                break;
            }
        }
        if(passesFilters){
            filteredChapters.set(id, chapter);
        }
    }
    return filteredChapters;
}

function parseAlterations(chapters, fields){
    // parse alterations
    let alterations = {};
    for(const field of fields){
        const name = field.id.replace("mass_new_", "");
        const values = field.value.split("\n");
        // file field is special snowflake
        if(name === "file"){
            alterations[name] = field.filesArray;
        }
        // if field has only 1 value, use that for every chapter
        else if(values.length === 1){
            alterations[name] = Array(chapters.size).fill(values[0]);
        }
        else{
            alterations[name] = values;
        }
    }

    // add alterations to chapter objects
    const altered_chapters = new Map();
    let index = 0;
    for(const [id, chapter] of chapters){
        const altered_chapter = {"old": chapter, "new": {}};
        for(const [name, value] of Object.entries(alterations)){
            // only add if the alteration is different from the current value
            altered_chapter["new"][name] = chapter[name] !== value[index] ? value[index] || "" : "";
        }
        altered_chapters.set(id, altered_chapter);
        index++;
    }
    return(altered_chapters)
}

//TODO:
// hrefs
// language flags
function createChapter(chapter){
    const chapterID = chapter[0];
    const chapterInfo = chapter[1];
    const chapterEl = document.createElement("tr");
    for(const [name, value] of Object.entries(chapterInfo["old"])){
        if(name === "availability"){
            chapterEl.innerHTML +=
                `
                <td>
                    <a ${chapterInfo["new"][name] ? "style='color: red;'" : ""}">
                        ${value === "0" ? `<span class="fas fa-file-excel fa-fw " title="Unavailable"></span>` : ""}
                    </a>
                    <a style="color: green;">
                        ${chapterInfo["new"][name] === "0" ? `<span class="fas fa-file-excel fa-fw " title="Unavailable"></span>` : ""}
                    </a>
                </td>
                `
        }
        else if(name === "file"){
            chapterEl.innerHTML +=
                `
                <td>
                    <a style="color: green;">
                        ${chapterInfo["new"][name] ? `<span class="fas fa-file-upload fa-fw " title="${chapterInfo["new"][name].name}"></span>` : ""}
                    </a>
                </td>
                `
        }
        else{
            chapterEl.innerHTML +=
                `
                <td>
                    <a ${chapterInfo["new"][name] ? "style='color: red;'" : ""}">
                        ${value}
                    </a>
                    <br>
                    <a style="color: green;">
                        ${chapterInfo["new"][name]}
                    </a>
                </td>
                `
        }
    }
    return chapterEl;
}

async function applyMassEdit(){
    const filterFields = document.getElementById("mass_edit_form").querySelectorAll("textarea[id^='mass_'][id$='_to_edit']");
    const alterFields = document.getElementById("mass_edit_form").querySelectorAll("textarea[id^='mass_new'], input[id^='mass_new']");

    let chapterList = filterChapters(parseChapterList(), parseFilters(filterFields));
    chapterList = parseAlterations(chapterList, alterFields);

    for(const [id, chapter] of chapterList){

        // skip completely unchanged chapters
        if(Object.values(chapter["new"]).every(x => (x === undefined || x === ''))){
            showAlert("info", `Skipping unchanged chapter ${id}`)
            continue;
        }
        // use old value when new values are empty
        for(const [name, value] of Object.entries(chapter["new"])){
            chapter["new"][name] = value || chapter["old"][name];
        }

        const formData = new FormData();
        formData.append('manga_id', chapter["new"]["manga_id"]);
        formData.append('chapter_name', chapter["new"]["chapter_title"]);
        formData.append('volume_number', chapter["new"]["volume_number"]);
        formData.append('chapter_number', chapter["new"]["chapter_number"]);
        formData.append('group_id', chapter["new"]["group_id"]);
        formData.append('group_id_2', chapter["new"]["group_2_id"]);
        formData.append('group_id_3', chapter["new"]["group_3_id"]);
        formData.append('lang_id', chapter["new"]["language_id"]);
        formData.append('user_id', chapter["new"]["uploader_id"]);
        if(chapter["new"]["availability"] == "0"){
            formData.append('unavailable', "1");
        }
        if(chapter["new"]["file"]){
            formData.append('old_file', "1");
            formData.append('file', chapter["new"]["file"]);
        }
        const headers = new Headers();
        headers.append("x-requested-with", "XMLHttpRequest");

        const {ok} = await fetch(`https://mangadex.org/ajax/actions.ajax.php?function=chapter_edit&id=${id}`, {
            method: 'POST',
            headers,
            body: formData,
            credentials: "same-origin",
            cache: "no-store"
        });

        if(!ok)
        {
            console.log(`Not ok ${id}`);
            showAlert("danger", `Not ok ${id}`);
        }
        else{
            console.log(`Ok ${id}`);
            showAlert("success", `Ok ${id}`);
        }
        console.log(chapter);
        console.log(formData);
    }
    showAlert("info", `Done`);
}

async function applyMassDelete(){
    const filterFields = document.getElementById("mass_edit_form").querySelectorAll("textarea[id^='mass_'][id$='_to_edit']");
    const alterFields = document.getElementById("mass_edit_form").querySelectorAll("textarea[id^='mass_new'], input[id^='mass_new']");

    let chapterList = filterChapters(parseChapterList(), parseFilters(filterFields));
    chapterList = parseAlterations(chapterList, alterFields);

    if(!confirm(`You are about to delete ${chapterList.size} chapters`)){
        return;
    }
    for(const [id, chapter] of chapterList){
        const headers = new Headers();
        headers.append("x-requested-with", "XMLHttpRequest");

        const {ok} = await fetch(`https://mangadex.org/ajax/actions.ajax.php?function=chapter_delete&id=${id}`, {
            method: 'POST',
            headers,
            credentials: "same-origin",
            cache: "no-store"
        });

        if(!ok)
        {
            console.log(`Not ok ${id}`);
            showAlert("danger", `Not ok ${id}`);
        }
        else{
            console.log(`Ok ${id}`);
            showAlert("success", `Ok ${id}`);
        }
        console.log(chapter);
    }
    showAlert("info", `Done`);
}

function showAlert(type, text){
    const alertBox = document.getElementById("message_container");
    alertBox.classList.replace("display-none", "display-block");
    alertBox.innerHTML =
        `
        <div class='alert alert-${type} text-center' style='pointer-events: auto;' role='alert'>
            <a href='#' class='float-right fas fa-window-close' data-dismiss='alert'></a>
            ${text}
        </div>
        `;
}

(function main(){
    const page = window.location.href.match(/(?<=mangadex.org\/)(title|group|user)/gi)[0];
    const tab = window.location.href.match(/(?<=.*\/?)(chapters|mod_chapters|deleted)?(?=\/?[0-9]*\/?$)/gi)[0] || "chapters";

    // I like to tell myself that someday I'll actually implement the other tabs
    if(tab !== "mod_chapters"){
        return;
    }

    // create mass edit form and append
    getContainer(page).appendChild(createMassEditForm(page));
    // create button to open the form
    getButtonContainer(page).appendChild(createButton("mass_edit", "edit", "success", toggleMassEditForm));
    // set initial preview
    updatePreview();
})();
