// ==UserScript==
// @name         MangaDex Mass Editor v2 Beta
// @namespace    https://github.com/Xnot/userscripts
// @version      2.00
// @icon         https://mangadex.org/images/misc/default_brand.png?1
// @description  mass edit script but it doesn't make me want to kill myself when I look at the code
// @author       Xnot
// @updateURL    https://github.com/Xnot/userscripts/raw/master/mangadex-masseditor-v2.user.js
// @downloadURL  https://github.com/Xnot/userscripts/raw/master/mangadex-masseditor-v2.user.js
// @include      /.*mangadex\.org/(title|group|user)/([0-9]*?)/([^/]*)/?((chapters|mod_chapters|deleted)/?)?$
// @grant        none
// ==/UserScript==

//TODO: 
// add nuke button with confirm dialog
// grabbing chapter ID will be necessary for href and submitting the requests
// fix for groups without descriptions
// stop preview from going down

function createInfoBox(){
    const infoBox = document.createElement("div");
    infoBox.classList.add("alert", "alert-info", "col-12");
    infoBox.setAttribute("role", "alert");
    infoBox.innerHTML =
        `
        <h6>MangaDex Mass Editor Script v${GM_info.script.version}</h6>
        <ul>
            <li>Use the 'to edit' fields to grab the chapters you want. Each line is one value
            <li>Use 'Read Online' to grab empty titles, ' ' (a space) to grab empty chapter/volume numbers, and '0' to grab empty groups2/3
            <li>Only chapters in the page you are looking at can be grabbed
            <li>Filling in multiple 'to edit' fields will grab chapters that match both.
            <li>For example filling titles with 'Read Online' and volume with '4' and '2' will grab all chapters titled 'Read Online' in volumes 4 and 2
            <li>Empty 'to edit' fields are ignored
            <li>The 'new' fields determine the new values for the grabbed chapters top to bottom
            <li>Use ' ' to delete titles and chapter/volume numbers, and '0' to delete groups2/3
            <li>Inputting a single value will use that value for all grabbed chapters instead
            <li>Use the preview button if you feel so inclined
            <li>Press the Apply Edit button and wait until it's all cool and good
            <li>Refresh after every edit so you aren't editing based on outdated information.
        </ul>
        <h6>Contact Xnot on MangaDex or Discord if there are any problems</h6>
        <h6>Changelog:</h6>
        <ul>
            <li>This is a placeholder changelog.
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
                <span id=mass_new_file_arrow class="fas fa-angle-${arrowStart} fa-fw"></span>
            </label>
        </a>
        <div class="col-sm-10 ${fieldStart}" id="mass_new_file_container" style="">
            <div class="input-group">
                <input class="form-control" type="text" placeholder="No files selected" disabled="true">
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
    thisField.on("hidden.bs.collapse",
        function(){
            thisArrow.classList.replace("fa-angle-down", "fa-angle-right");
        });
    thisField.on("shown.bs.collapse",
        function(){
            thisArrow.classList.replace("fa-angle-right", "fa-angle-down");
        });
    
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
        editFields.push(["manga_id_to_edit", true])
    }
    if(page != "user"){
        editFields.push(["uploader_id_to_edit", true])
    }
    editFields.push(
        ["chapter_title_to_edit", false],
        ["volume_number_to_edit", false],
        ["chapter_number_to_edit", false],
        ["language_id_to_edit", true],
        ["group_id_to_edit", false],
        ["group_2_id_to_edit", true],
        ["group_3_id_to_edit", true],
        ["availability_to_edit", true],
        ["new_uploader_id", true],
        ["new_chapter_title", false],
        ["new_volume_number", false],
        ["new_chapter_number", false],
        ["new_language_id", true],
        ["new_group_id", false],
        ["new_group_2_id", true,],
        ["new_group_3_id", true],
        ["new_manga_id", true],
        ["new_availability", true],
    );
    // parse field HTML and append
    for(const field of editFields){
        massEditForm.appendChild(createEditField(field[0], field[1]));
    }
    // file upload field
    massEditForm.appendChild(createFileField());
    // action buttons
    massEditForm.appendChild(createButton("apply", "check-double", "success", x => {console.log("test")}));
    massEditForm.appendChild(createButton("delete", "dumpster-fire", "danger", x => {console.log("test")}));
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
    if(page == "group"){
        return document.getElementsByClassName("card mb-3")[5];
    }
    else{
        return document.getElementsByClassName("card mb-3")[0];
    }
}

// returns container in which openMassEditButton must be inserted
function getButtonContainer(page){
    if(page == "group"){
        return document.getElementsByClassName("card mb-3")[5].getElementsByClassName("card-body")[0];
    }
    else if(page == "title"){
        return document.getElementsByClassName("btn btn-info float-right")[0].parentNode;
    }
    else if(page == "user"){
        return document.getElementsByClassName("col-lg-9 col-xl-10")[8];
    }
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
    const parsedChapters = [];
    const unparsedElements = [...getChapterTable().getElementsByTagName("tbody")[0].getElementsByTagName("tr")];
    while(unparsedElements.length > 0){
        // throw away the chapter element and get the inputs from the inline edit element
        unparsedElements.shift();
        const inlineEdit = unparsedElements.shift().getElementsByTagName("input");
        parsedChapters.push({
            "manga_id": inlineEdit[0].value,
            "volume_number": inlineEdit[1].value,
            "chapter_number": inlineEdit[2].value,
            "chapter_title": inlineEdit[3].value,
            "language_id": inlineEdit[4].value,
            "group_id": inlineEdit[5].value,
            "group_2_id": inlineEdit[6].value,
            "group_3_id": inlineEdit[7].value,
            "uploader_id": inlineEdit[8].value,
            "availability": inlineEdit[9].value,
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
    const filteredChapters = [];
    for(const chapter of chapters){
        let passesFilters = true;
        for(const [name, values] of Object.entries(filters)){
            if(!values.includes(chapter[name])){
                passesFilters = false;
                break;
            }
        }
        if(passesFilters){
            filteredChapters.push(chapter);
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
        // if field has only 1 value, use that for every chapter 
        if(values.length === 1){
            alterations[name] = Array(chapters.length).fill(values[0])
        }
        else{
            alterations[name] = values;
        }
    }
    
    // add alterations to chapter objects
    const altered_chapters = [];
    for(const [index, chapter] of chapters.entries()){
        const altered_chapter = {"old": chapter, "new": {}};
        for(const [name, value] of Object.entries(alterations)){
            // only add if the alteration is different from the current value
            altered_chapter["new"][`${name}`] = chapter[name] !== value[index] ? value[index] : "";
        }
        altered_chapters.push(altered_chapter);
    }
    
    return(altered_chapters)
}

//TODO:
// hrefs
// language flags
// available icon
// file icon
function createChapter(chapterInfo){
    const chapter = document.createElement("tr");
    for(const [name, value] of Object.entries(chapterInfo["old"])){
        chapter.innerHTML +=
            `
            <td>
                <a ${chapterInfo["new"][name] ? "style='color: red;'" : ""}">
                    ${chapterInfo["old"][name]}
                </a>
                <br>
                <a style="color: green;">
                    ${chapterInfo["new"][name]}
                </a>
            </td>
            `
    }
    return chapter;
}

(function main(){    
    const page = window.location.href.match(/(?<=mangadex.org\/)(title|group|user)/gi)[0]; 
    const tab = window.location.href.match(/(?<=.*\/?)(chapters|mod_chapters|deleted)?(?=\/?$)/gi)[0] || "chapters";
    
    // create mass edit form and append 
    getContainer(page).appendChild(createMassEditForm(page));
    // create button to open the form
    getButtonContainer(page).appendChild(createButton("mass_edit", "edit", "success", toggleMassEditForm));
    // set initial preview
    updatePreview();
})();
