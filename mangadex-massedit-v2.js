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

function createInfoBox(version = ""){
    const infoBox = document.createElement("div");
    infoBox.classList.add("alert", "alert-info");
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
    
    return editField;
}

function createButton(name, icon, color, action){
    const button = document.createElement("button");
    button.setAttribute("id", `mass_${name}_button`);
    button.setAttribute("type", "button");
    button.classList.add("btn", "float-right", "mr-1", `btn-${color}`);
    button.innerHTML =
        `
        <span class="fas fa-${icon} fa-fw " aria-hidden="true" title="${name}"></span>
        <span class="d-none d-xl-inline" style="text-transform: capitalize;">${name.replace(/_/g, " ")}</span>
        `;
    button.addEventListener("click", action);
    
    return button;
}

function createMassEditForm(page){
    const massEditForm = document.createElement("form");
    massEditForm.setAttribute("id", "mass_edit_form");
    massEditForm.classList.add("card-body");
    massEditForm.style.display = "none";
    
    // create elements contained in the form
    let formElements = [];
    // information dialog 
    formElements.push(createInfoBox("2.00"));
    // mass edit fields
    let editFields = [];
    if(page != "title"){
        editFields.push(["manga_to_edit", true])
    }
    if(page != "user"){
        editFields.push(["uploader_to_edit", true])
    }
    editFields.push(
        ["chapter_title_to_edit", false],
        ["volume_number_to_edit", false],
        ["chapter_number_to_edit", false],
        ["language_to_edit", true],
        ["group_id_to_edit", false],
        ["group_2_id_to_edit", true],
        ["group_3_id_to_edit", true],
        ["availability_to_edit", true],
        ["new_uploader", true],
        ["new_chapter_title", false],
        ["new_volume_number", false],
        ["new_chapter_number", false],
        ["new_language", true],
        ["new_group_id", false],
        ["new_group_2_id", true,],
        ["new_group_3_id", true],
        ["new_manga_id", true],
        ["new_availability", true],
    );
    // parse field HTML and push
    for(const field of editFields){
        formElements.push(createEditField(field[0], field[1]));
    }
    // confirm/close buttons
    formElements.push(createButton("apply", "check-double", "success", x => {console.log("test")}));
    formElements.push(createButton("close", "window-close", "danger", toggleMassEditForm));
    
    //TODO:
    // less cancerous spacing
    const spacer = document.createElement("br");
    spacer.setAttribute("clear", "all");
    formElements.push(spacer);
    formElements.push(spacer.cloneNode());
    
    //preview container
    formElements.push(createMassEditPreview());
    
    // append all elements
    for(const child of formElements){
        massEditForm.appendChild(child);
    }
    return massEditForm;
}

function createMassEditPreview(){
    const editPreviewTable = document.getElementsByClassName("table table-striped table-hover table-sm")[0].cloneNode(true);
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
    const massEditForm = document.getElementById("mass_edit_form");
    massEditForm.previousElementSibling.style.display = massEditForm.previousElementSibling.style.display == "none" ? "block" : "none";
    massEditForm.style.display = massEditForm.style.display == "none" ? "block" : "none";
}

(function main(){    
    const page = window.location.href.match(/(?<=mangadex.org\/)(title|group|user)/gi)[0]; 
    const tab = window.location.href.match(/(?<=.*\/?)(chapters|mod_chapters|deleted)?(?=\/?$)/gi)[0] || "chapters";
    
    // create mass edit form and append 
    getContainer(page).appendChild(createMassEditForm(page));
    // create button to open the form
    getButtonContainer(page).appendChild(createButton("mass_edit", "edit", "success", toggleMassEditForm));
})();