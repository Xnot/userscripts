// ==UserScript==
// @name         MangaDex Mass Editor v2 Beta
// @namespace    https://github.com/Xnot/userscripts
// @version      2.00
// @icon         https://mangadex.org/images/misc/default_brand.png?1
// @description  mass edit script but it doesn't make me want to kill myself when I look at the code
// @author       Xnot
// @updateURL    https://github.com/Xnot/userscripts/raw/master/mangadex-masseditor-v2.user.js
// @downloadURL  https://github.com/Xnot/userscripts/raw/master/mangadex-masseditor-v2.user.js
// @include      /.*mangadex\.org/title/.*/mod_chapters
// @grant        none
// ==/UserScript==

function createInfoBox(version = "", changelog = "") {
    const infoBox = document.createElement("div");
    infoBox.classList.add("alert", "alert-info");
    infoBox.setAttribute("role", "alert");
    infoBox.innerHTML =
        `
        <div class="alert alert-info" role="alert">
        <h6>MangaDex Mass Editor Script v${version}</h6>
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
        <h6>Update ${version}:</h6>
        <ul>
            ${changelog}
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
            <label for="mass_${name}" class="control-label">
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

function createMassEditForm(children){
    const massEditForm = document.createElement("form");
    massEditForm.setAttribute("id", "mass_edit_form");
    massEditForm.classList.add("card-body");
    for(const child of children){
        massEditForm.appendChild(child);
    }
    return massEditForm;
}

function getContainer(){
    return document.getElementsByClassName("card mb-3")[0].getElementsByClassName("card-body p-0")[0];
}

(function main(){
    const editFields = [
        "uploader_to_edit",
        "chapter_title_to_edit",
        "volume_number_to_edit",
        "chapter_number_to_edit",
        "language_to_edit",
        "group_id_to_edit",
        "group_2_id_to_edit",
        "group_3_id_to_edit",
        "availability_id_to_edit",
        "new_uploader",
        "new_chapter_title",
        "new_volume_number",
        "new_chapter_number",
        "new_language",
        "new_group_id",
        "new_group_2_id",
        "new_group_3_id",
        "new_manga_id",
        "new_availability", 
    ];
    
    let formElements = [];
    for(const field of editFields){
        formElements.push(createEditField(field, true));
    }
    
    getContainer().appendChild(createMassEditForm(formElements));
})();