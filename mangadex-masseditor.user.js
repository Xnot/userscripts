// ==UserScript==
// @name         MangaDex (shitty) Mass Editor
// @namespace    https://github.com/LucasPratas/userscripts
// @version      0.37
// @icon         https://mangadex.org/favicon.ico
// @description  stop robo from nuking untitled chapters by ripping off bcvxy's script
// @author       bcvxy, Xnot
// @updateURL    https://github.com/LucasPratas/userscripts/raw/master/mangadex-masseditor.user.js
// @downloadURL  https://github.com/LucasPratas/userscripts/raw/master/mangadex-masseditor.user.js
// @match        https://mangadex.org/manga/*
// @grant        none
// ==/UserScript==

function createForm()
{

    //create mass edit form
    var massEditForm = document.createElement("form");
    massEditForm.setAttribute("id", "mass_edit_form");
    massEditForm.classList.add("form-horizontal", "panel-body");
    massEditForm.style.display = "none";
    var container = document.getElementById("content").getElementsByClassName("panel panel-default")[0];
    var mangaInfo = container.getElementsByClassName("row edit")[0];
    container.appendChild(massEditForm);

    var userscriptInfo = document.createElement("div"); //info panel with userscript instructions
    userscriptInfo.classList.add("alert", "alert-info");
    userscriptInfo.setAttribute("role", "alert");
    userscriptInfo.innerHTML = "<h4>You are using Mangadex (shitty) Mass <strike>Uploader</strike> Editor™ ßeta by Xnot with <strike>a lot of</strike> some code ripped off of bcvxy</h4>" +
        "<ol><li>Insert chapter numbers to edit and the new titles in respective fields. Each line is one chapter" +
        "<li>Click the Mass Upload button" +
        "<br />It only matches by chapter number for now so probably don't use this on manga which resets chapter count by volume or with multiple uploads of the same chapter" +
        "<br />Editing stuff other than titles soon™</ol>" + 
    "If there are any problems @ or pm me on Discord<br />" +
    "Update 0.36:" +
        "<ul><li>Used latest version of bcvxy's script to add language processing" +
        "<li>Now only pushes chapters that will get changed to prevent some unnecessary processing</ul>" + 
    "Update 0.37:" +
        "<ul><li>Changed some icons and colors <strike>so that it doesn't look like I copy-pasted everything from my other script</strike>" +
        "<li>Text areas are somewhat larger by default" + 
        "<li>Form container now has some margins that makes it look better</ul>" ;
    var container = document.getElementById("content");
    massEditForm.appendChild(userscriptInfo); //insert info panel

    //create chapter number to edit field
    var chapterNumberToEditContainer = document.createElement("div");
    chapterNumberToEditContainer.classList.add("form-group");
    massEditForm.appendChild(chapterNumberToEditContainer);
    var chapterNumberToEditLabel = document.createElement("label");
    chapterNumberToEditLabel.setAttribute("for","mass_chapter_number_to_edit");
    chapterNumberToEditLabel.classList.add("col-sm-3", "control-label");
    chapterNumberToEditLabel.innerText = "Chapter numbers to edit";
    chapterNumberToEditContainer.appendChild(chapterNumberToEditLabel);
    var chapterNumberToEditFieldContainer = document.createElement("div");
    chapterNumberToEditFieldContainer.classList.add("col-sm-9");
    chapterNumberToEditContainer.appendChild(chapterNumberToEditFieldContainer);
    var chapterNumberToEditField = document.createElement("textarea");
    chapterNumberToEditField.setAttribute("id", "mass_chapter_number_to_edit");
    chapterNumberToEditField.setAttribute("name", "mass_chapter_number_to_edit");
    chapterNumberToEditField.setAttribute("placeholder", "1\n2\n3");
    chapterNumberToEditField.classList.add("form-control");
    chapterNumberToEditField.style.height = "120px";
    chapterNumberToEditFieldContainer.appendChild(chapterNumberToEditField);

    //create new chapter title field
    var newChapterTitleContainer = document.createElement("div");
    newChapterTitleContainer.classList.add("form-group");
    massEditForm.appendChild(newChapterTitleContainer);
    var newChapterTitleLabel = document.createElement("label");
    newChapterTitleLabel.setAttribute("for","mass_new_chapter_title");
    newChapterTitleLabel.classList.add("col-sm-3", "control-label");
    newChapterTitleLabel.innerText = "New Chapter Titles";
    newChapterTitleContainer.appendChild(newChapterTitleLabel);
    var newChapterTitleFieldContainer = document.createElement("div");
    newChapterTitleFieldContainer.classList.add("col-sm-9");
    newChapterTitleContainer.appendChild(newChapterTitleFieldContainer);
    var newChapterTitleField = document.createElement("textarea");
    newChapterTitleField.setAttribute("id", "mass_new_chapter_title");
    newChapterTitleField.setAttribute("name", "mass_new_chapter_title");
    newChapterTitleField.setAttribute("placeholder", "title1\ntitle2\ntitle3");
    newChapterTitleField.classList.add("form-control");
    newChapterTitleField.style.height = "120px";
    newChapterTitleFieldContainer.appendChild(newChapterTitleField);

    //create buttons
    var buttonsContainer = document.createElement("div");
    buttonsContainer.classList.add("form-group");
    massEditForm.appendChild(buttonsContainer);
    var buttonsDiv = document.createElement("div");
    buttonsDiv.classList.add("col-sm-12", "text-right", "btn-toolbar");
    buttonsContainer.appendChild(buttonsDiv);
    var editButton = document.createElement("button");
    editButton.setAttribute("id", "mass_edit_save_button");
    editButton.setAttribute("type", "button");
    editButton.classList.add("btn", "btn-success", "pull-right");
    buttonsDiv.appendChild(editButton);
    var editButtonIcon = document.createElement("span");
    editButtonIcon.classList.add("fas", "fa-save", "fa-fw");
    editButtonIcon.style.marginRight = "3px";
    editButton.appendChild(editButtonIcon);
    var editButtonText = document.createElement("span");
    editButtonText.classList.add("span-1280");
    editButtonText.innerText = "Apply Edit";
    editButton.appendChild(editButtonText);
    var cancelButton = document.createElement("button");
    cancelButton.setAttribute("id", "mass_edit_cancel_button");
    cancelButton.setAttribute("type", "button");
    cancelButton.classList.add("btn", "btn-danger", "pull-right");
    buttonsDiv.appendChild(cancelButton);
    var cancelButtonIcon = document.createElement("span");
    cancelButtonIcon.classList.add("fas", "fa-ban", "fa-fw");
    cancelButtonIcon.style.marginRight = "3px";
    cancelButton.appendChild(cancelButtonIcon);
    var cancelButtonText = document.createElement("span");
    cancelButtonText.classList.add("span-1280");
    cancelButtonText.innerText = "Cancel";
    cancelButton.appendChild(cancelButtonText);
    editButton.addEventListener("click", function(event)
                                        {
                                            event.preventDefault();
                                            massEdit([chapterNumberToEditField.value.split("\n"), newChapterTitleField.value.split("\n")]);
                                        });
    cancelButton.addEventListener("click", function()
                                            {
                                                massEditForm.reset();
                                                massEditForm.style.display = "none";
                                                mangaInfo.style.display =  "block";
                                            });

    //add mass edit button to open form
    var actionsContainer = document.getElementById("upload_button").parentNode;
    actionsContainer.classList.add("btn-toolbar");
    var openEditButton = document.createElement("button");
    openEditButton.setAttribute("id", "mass_edit_open_button");
    openEditButton.setAttribute("type", "button");
    openEditButton.classList.add("btn", "btn-success", "pull-right");
    actionsContainer.appendChild(openEditButton);
    var openEditButtonIcon = document.createElement("span");
    openEditButtonIcon.classList.add("fas", "fa-edit", "fa-fw");
    openEditButtonIcon.style.marginRight = "3px";
    openEditButton.appendChild(openEditButtonIcon);
    var openEditButtonText = document.createElement("span");
    openEditButtonText.classList.add("span-1280");
    openEditButtonText.innerText = "Mass Edit";
    openEditButton.appendChild(openEditButtonText);
    openEditButton.addEventListener("click", function()
                                            {
                                                mangaInfo.style.display = "none";
                                                massEditForm.style.display = "block";
                                            });
}
createForm();

function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;

    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

async function massEdit(fields) {
    'use strict';

    const langs =
    {
        "English":"1",
        "Japanese":"2",
        "Polish":"3",
        "Serbo-Croatian":"4",
        "Dutch":"5",
        "Italian":"6",
        "Russian":"7",
        "German":"8",
        "Hungarian":"9",
        "French":"10",
        "Finnish":"11",
        "Vietnamese":"12",
        "Greek":"13",
        "Bulgarian":"14",
        "Spanish (Spain)":"15",
        "Portuguese (Brazil)":"16",
        "Portuguese (Portugal)":"17",
        "Swedish":"18",
        "Arabic":"19",
        "Danish":"20",
        "Chinese":"21",
        "Bengali":"22",
        "Romanian":"23",
        "Czech":"24",
        "Mongolian":"25",
        "Turkish":"26",
        "Indonesian":"27",
        "Korean":"28",
        "Spanish (LATAM)":"29",
        "Persian":"30",
        "Malaysian":"31",
        "Thai":"32",
        "Catalan":"33"
    };

    const manga = (/\/(\d+)/g).exec(window.location.href)[1];

	//List of chapters to edit
    let toEdit = [];

    // good place to put some data:
    const titles = {};
    for(let i = 0; i < fields[0].length; i++)
    {
        titles[fields[0][i]] = fields[1][i];
    }
    $('a[href*="/chapter/"').each(function (chapter)
                                    {

                                        
                                        const chapNum = $(this).get(0).getAttribute('data-chapter-num');
                                        if(fields[0].includes(chapNum)) //only push chapters in list
                                        {
                                            const chapId = $(this).get(0).href.match(/(\d+)/)[0];
                                            const volNum = $(this).get(0).getAttribute('data-volume-num');
                                            const title = $(this).get(0).getAttribute('data-chapter-name');
                                            const groupId = $(this).closest('tr').find('a[href*="/group/"]')[0].href.match(/(\d+)/)[0];
                                            var group2Id = 0;
                                            var group3Id = 0;
                                            if($(this).closest('tr').find('a[href*="/group/"]').length > 1)
                                            {
                                                group2Id = $(this).closest('tr').find('a[href*="/group/"]')[1].href.match(/(\d+)/)[0];
                                            }
                                            if($(this).closest('tr').find('a[href*="/group/"]').length > 2)
                                            {
                                                group3Id = $(this).closest('tr').find('a[href*="/group/"]')[2].href.match(/(\d+)/)[0];
                                            }
                                            const langTitle = $(this).closest('tr').find('img[src*="/images/flags/"]')[0].title;
                                            toEdit.push([chapId, volNum, chapNum, title, groupId, group2Id, group3Id, langTitle]);
                                        }
                                    });
    toEdit = toEdit.reverse();
    for (let i = 0, len = toEdit.length; i < len; i++)
    {
        console.log("Processing chapter #" + (i+1) + " of " + len);
        // data format 0:chapId 1:volNum 2:chapNum 3:title 4:groupId 5:group2Id 6:group3Id 7:langTitle 8:file(optional)
        var oldData = toEdit[i];
        var newData = oldData.slice(0);

        // oldData holds the current information for the chapter. Don't change it
        // make your changes to newData, which is a clone of oldData by default
        // --- CHANGES TO DATA HERE ---
        newData[3] = titles[oldData[2]] || oldData[3];

        // check for either volume or chapter present
        if ((x => y => x || y)(newData[2], newData[1]));
        else
            continue;
        // check wether the data is actually different
        if (arraysEqual(oldData, newData)){
            console.log("No changes, skipping...");
            continue;
        }

        // build formdata and POST
        const formData = new FormData();
        formData.append('manga_id', manga);
        formData.append('chapter_name', newData[3]);
        formData.append('volume_number', newData[1]);
        formData.append('chapter_number', newData[2]);
        formData.append('group_id', newData[4]);
        formData.append('group_id_2', newData[5]);
        formData.append('group_id_3', newData[6]);
        formData.append('lang_id', langs[newData[7]]);
        formData.append('file', newData[8]);

        const headers = new Headers();
        headers.append("x-requested-with", "XMLHttpRequest");

        // send 'em away
        try {
            const {ok} = await fetch('https://mangadex.org/ajax/actions.ajax.php?function=chapter_edit&id=' + newData[0], {
                method: 'POST',
                headers,
                body: formData,
                credentials: "same-origin",
                cache: "no-store"
            });

            if(!ok)
                throw new Error("Not ok.");

            console.log('ok.');
        } catch(e) {
            console.error('Error:', e);
        }
    }
    console.log("%call cool and good 👌", "color:green");
}