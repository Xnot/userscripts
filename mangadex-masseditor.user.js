// ==UserScript==
// @name         MangaDex (shitty) Mass Editor
// @namespace    https://github.com/LucasPratas/userscripts
// @version      0.60
// @icon         https://mangadex.org/favicon.ico
// @description  stop robo from nuking untitled chapters by ripping off bcvxy's script
// @author       bcvxy, Xnot
// @updateURL    https://github.com/LucasPratas/userscripts/raw/master/mangadex-masseditor.user.js
// @downloadURL  https://github.com/LucasPratas/userscripts/raw/master/mangadex-masseditor.user.js
// @match        https://mangadex.org/manga/*
// @grant        none
// ==/UserScript==

function createForm() //creates mass edit form
{
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
    userscriptInfo.innerHTML = "<h4>You are using Mangadex (shitty) Mass Editor ßeta by Xnot with some code borrowed from bcvxy</h4>" +
        "<ol><li>Use the 'to edit' fields to grab the chapters you want. Each line is one value" +
        "<br />Filling in multiple 'to edit' fields will grab chapters that match both. For example filling titles with 'Read Online' and volume with '4' and '2' will grab all chapters titled 'Read Online' in volumes 4 and 2" +
        "<br />Filling in only some 'to edit' fields will ignore the others" +
        "<li>The 'new' fields determine the new values for the grabbed chapters top to bottom" +
        "<li>Just use the preview button and figure it out because it's pretty confusing <strike>and these instructions are shit</strike>" +
        "<li>Press the Apply Edit button and wait an undetermined amount of time because I haven't added any sort of progress tracking yet (there is some in the console though thx bcvxy)" +
        "<li>Refresh after every edit so you aren't editing based on outdated information. Auto-refresh soon™" +
        "<li>Editing <strike>stuff other than titles</strike> groups, languages and files soon™ maybe</ol>" +
    "If there are any problems @ or pm me on Discord<br />" +
    "Update 0.37:" +
        "<ul><li>Changed some icons and colors <strike>so that it doesn't look like I copy-pasted everything from my other script</strike>" +
        "<li>Text areas are somewhat larger by default" +
        "<li>Form container now has some margins that makes it look better</ul>" +
    "Update 0.60:" +
        "<ul><li>Added a bunch of other fields to match chapters with" +
        "<li>Added a bunch of other fields to edit chapters with" +
        "<li>Added a preview button <strike>because the new fields are a mess</strike>" +
        "<li><strike>Hopefully I didn't fuck anything up and the preview actually matches the results</strike></ul>";
    massEditForm.appendChild(userscriptInfo); //insert info panel

    //create chapter title to edit field
    var chapterTitleToEditContainer = document.createElement("div");
    chapterTitleToEditContainer.classList.add("form-group");
    massEditForm.appendChild(chapterTitleToEditContainer);
    var chapterTitleToEditLabel = document.createElement("label");
    chapterTitleToEditLabel.setAttribute("for","mass_chapter_title_to_edit");
    chapterTitleToEditLabel.classList.add("col-sm-3", "control-label");
    chapterTitleToEditLabel.innerText = "Chapter titles to edit";
    chapterTitleToEditContainer.appendChild(chapterTitleToEditLabel);
    var chapterTitleToEditFieldContainer = document.createElement("div");
    chapterTitleToEditFieldContainer.classList.add("col-sm-9");
    chapterTitleToEditContainer.appendChild(chapterTitleToEditFieldContainer);
    var chapterTitleToEditField = document.createElement("textarea");
    chapterTitleToEditField.setAttribute("id", "mass_chapter_title_to_edit");
    chapterTitleToEditField.setAttribute("name", "mass_chapter_title_to_edit");
    chapterTitleToEditField.setAttribute("placeholder", "Read Online\nRead Offline\nPlaceholder3");
    chapterTitleToEditField.classList.add("form-control");
    chapterTitleToEditField.style.height = "120px";
    chapterTitleToEditFieldContainer.appendChild(chapterTitleToEditField);

    //create volume number to edit field
    var volumeNumberToEditContainer = document.createElement("div");
    volumeNumberToEditContainer.classList.add("form-group");
    massEditForm.appendChild(volumeNumberToEditContainer);
    var volumeNumberToEditLabel = document.createElement("label");
    volumeNumberToEditLabel.setAttribute("for","mass_volume_number_to_edit");
    volumeNumberToEditLabel.classList.add("col-sm-3", "control-label");
    volumeNumberToEditLabel.innerText = "Volume numbers to edit";
    volumeNumberToEditContainer.appendChild(volumeNumberToEditLabel);
    var volumeNumberToEditFieldContainer = document.createElement("div");
    volumeNumberToEditFieldContainer.classList.add("col-sm-9");
    volumeNumberToEditContainer.appendChild(volumeNumberToEditFieldContainer);
    var volumeNumberToEditField = document.createElement("textarea");
    volumeNumberToEditField.setAttribute("id", "mass_volume_number_to_edit");
    volumeNumberToEditField.setAttribute("name", "mass_volume_number_to_edit");
    volumeNumberToEditField.setAttribute("placeholder", "1\n2\n3");
    volumeNumberToEditField.classList.add("form-control");
    volumeNumberToEditField.style.height = "120px";
    volumeNumberToEditFieldContainer.appendChild(volumeNumberToEditField);

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

    //create language to edit field
    var languageToEditContainer = document.createElement("div");
    languageToEditContainer.classList.add("form-group");
    massEditForm.appendChild(languageToEditContainer);
    var languageToEditLabel = document.createElement("label");
    languageToEditLabel.setAttribute("for","mass_language_to_edit");
    languageToEditLabel.classList.add("col-sm-3", "control-label");
    languageToEditLabel.innerText = "Languages to edit";
    languageToEditContainer.appendChild(languageToEditLabel);
    var languageToEditFieldContainer = document.createElement("div");
    languageToEditFieldContainer.classList.add("col-sm-9");
    languageToEditContainer.appendChild(languageToEditFieldContainer);
    var languageToEditField = document.createElement("textarea");
    languageToEditField.setAttribute("id", "mass_language_to_edit");
    languageToEditField.setAttribute("name", "mass_language_to_edit");
    languageToEditField.setAttribute("placeholder", "English\nSpanish (Es)\nPortuguese (Br)");
    languageToEditField.classList.add("form-control");
    languageToEditField.style.height = "120px";
    languageToEditFieldContainer.appendChild(languageToEditField);

    //create groupid to edit field
    var groupIdToEditContainer = document.createElement("div");
    groupIdToEditContainer.classList.add("form-group");
    massEditForm.appendChild(groupIdToEditContainer);
    var groupIdToEditLabel = document.createElement("label");
    groupIdToEditLabel.setAttribute("for","mass_group_id_to_edit");
    groupIdToEditLabel.classList.add("col-sm-3", "control-label");
    groupIdToEditLabel.innerText = "Group IDs to edit";
    groupIdToEditContainer.appendChild(groupIdToEditLabel);
    var groupIdToEditFieldContainer = document.createElement("div");
    groupIdToEditFieldContainer.classList.add("col-sm-9");
    groupIdToEditContainer.appendChild(groupIdToEditFieldContainer);
    var groupIdToEditField = document.createElement("textarea");
    groupIdToEditField.setAttribute("id", "mass_group_id_to_edit");
    groupIdToEditField.setAttribute("name", "mass_group_id_to_edit");
    groupIdToEditField.setAttribute("placeholder", "1\n2\n3");
    groupIdToEditField.classList.add("form-control");
    groupIdToEditField.style.height = "120px";
    groupIdToEditFieldContainer.appendChild(groupIdToEditField);

    //create group2id to edit field
    var group2IdToEditContainer = document.createElement("div");
    group2IdToEditContainer.classList.add("form-group");
    massEditForm.appendChild(group2IdToEditContainer);
    var group2IdToEditLabel = document.createElement("label");
    group2IdToEditLabel.setAttribute("for","mass_group_2_id_to_edit");
    group2IdToEditLabel.classList.add("col-sm-3", "control-label");
    group2IdToEditLabel.innerText = "Group 2 IDs to edit";
    group2IdToEditContainer.appendChild(group2IdToEditLabel);
    var group2IdToEditFieldContainer = document.createElement("div");
    group2IdToEditFieldContainer.classList.add("col-sm-9");
    group2IdToEditContainer.appendChild(group2IdToEditFieldContainer);
    var group2IdToEditField = document.createElement("textarea");
    group2IdToEditField.setAttribute("id", "mass_group_2_id_to_edit");
    group2IdToEditField.setAttribute("name", "mass_group_2_id_to_edit");
    group2IdToEditField.setAttribute("placeholder", "1\n2\n3");
    group2IdToEditField.classList.add("form-control");
    group2IdToEditField.style.height = "120px";
    group2IdToEditFieldContainer.appendChild(group2IdToEditField);

    //create group3id to edit field
    var group3IdToEditContainer = document.createElement("div");
    group3IdToEditContainer.classList.add("form-group");
    massEditForm.appendChild(group3IdToEditContainer);
    var group3IdToEditLabel = document.createElement("label");
    group3IdToEditLabel.setAttribute("for","mass_group_3_id_to_edit");
    group3IdToEditLabel.classList.add("col-sm-3", "control-label");
    group3IdToEditLabel.innerText = "Group 3 IDs to edit";
    group3IdToEditContainer.appendChild(group3IdToEditLabel);
    var group3IdToEditFieldContainer = document.createElement("div");
    group3IdToEditFieldContainer.classList.add("col-sm-9");
    group3IdToEditContainer.appendChild(group3IdToEditFieldContainer);
    var group3IdToEditField = document.createElement("textarea");
    group3IdToEditField.setAttribute("id", "mass_group_3_id_to_edit");
    group3IdToEditField.setAttribute("name", "mass_group_3_id_to_edit");
    group3IdToEditField.setAttribute("placeholder", "1\n2\n3");
    group3IdToEditField.classList.add("form-control");
    group3IdToEditField.style.height = "120px";
    group3IdToEditFieldContainer.appendChild(group3IdToEditField);

    //create new chapter title field
    var newChapterTitleContainer = document.createElement("div");
    newChapterTitleContainer.classList.add("form-group");
    massEditForm.appendChild(newChapterTitleContainer);
    var newChapterTitleLabel = document.createElement("label");
    newChapterTitleLabel.setAttribute("for","mass_new_chapter_title");
    newChapterTitleLabel.classList.add("col-sm-3", "control-label");
    newChapterTitleLabel.innerText = "New chapter titles";
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

    //create new volume number field
    var newVolumeNumberContainer = document.createElement("div");
    newVolumeNumberContainer.classList.add("form-group");
    massEditForm.appendChild(newVolumeNumberContainer);
    var newVolumeNumberLabel = document.createElement("label");
    newVolumeNumberLabel.setAttribute("for","mass_new_volume_number");
    newVolumeNumberLabel.classList.add("col-sm-3", "control-label");
    newVolumeNumberLabel.innerText = "New volume numbers";
    newVolumeNumberContainer.appendChild(newVolumeNumberLabel);
    var newVolumeNumberFieldContainer = document.createElement("div");
    newVolumeNumberFieldContainer.classList.add("col-sm-9");
    newVolumeNumberContainer.appendChild(newVolumeNumberFieldContainer);
    var newVolumeNumberField = document.createElement("textarea");
    newVolumeNumberField.setAttribute("id", "mass_new_volume_number");
    newVolumeNumberField.setAttribute("name", "mass_new_volume_number");
    newVolumeNumberField.setAttribute("placeholder", "volume1\nvolume2\nvolume3");
    newVolumeNumberField.classList.add("form-control");
    newVolumeNumberField.style.height = "120px";
    newVolumeNumberFieldContainer.appendChild(newVolumeNumberField);

    //create new chapter number field
    var newChapterNumberContainer = document.createElement("div");
    newChapterNumberContainer.classList.add("form-group");
    massEditForm.appendChild(newChapterNumberContainer);
    var newChapterNumberLabel = document.createElement("label");
    newChapterNumberLabel.setAttribute("for","mass_new_chapter_number");
    newChapterNumberLabel.classList.add("col-sm-3", "control-label");
    newChapterNumberLabel.innerText = "New chapter numbers";
    newChapterNumberContainer.appendChild(newChapterNumberLabel);
    var newChapterNumberFieldContainer = document.createElement("div");
    newChapterNumberFieldContainer.classList.add("col-sm-9");
    newChapterNumberContainer.appendChild(newChapterNumberFieldContainer);
    var newChapterNumberField = document.createElement("textarea");
    newChapterNumberField.setAttribute("id", "mass_new_chapter_number");
    newChapterNumberField.setAttribute("name", "mass_new_chapter_number");
    newChapterNumberField.setAttribute("placeholder", "chapter1\nchapter2\nchapter3");
    newChapterNumberField.classList.add("form-control");
    newChapterNumberField.style.height = "120px";
    newChapterNumberFieldContainer.appendChild(newChapterNumberField);

    //create new language field
    var newLanguageContainer = document.createElement("div");
    newLanguageContainer.classList.add("form-group");
    massEditForm.appendChild(newLanguageContainer);
    var newLanguageLabel = document.createElement("label");
    newLanguageLabel.setAttribute("for","mass_new_chapter_number");
    newLanguageLabel.classList.add("col-sm-3", "control-label");
    newLanguageLabel.innerText = "New languages";
    newLanguageContainer.appendChild(newLanguageLabel);
    var newLanguageFieldContainer = document.createElement("div");
    newLanguageFieldContainer.classList.add("col-sm-9");
    newLanguageContainer.appendChild(newLanguageFieldContainer);
    var newLanguageField = document.createElement("textarea");
    newLanguageField.setAttribute("id", "mass_new_chapter_number");
    newLanguageField.setAttribute("name", "mass_new_chapter_number");
    newLanguageField.setAttribute("placeholder", "English\nSpanish (Es)\nPortuguese (Br)");
    newLanguageField.classList.add("form-control");
    newLanguageField.style.height = "120px";
    newLanguageFieldContainer.appendChild(newLanguageField);

    //create new groupid field
    var newGroupIdContainer = document.createElement("div");
    newGroupIdContainer.classList.add("form-group");
    massEditForm.appendChild(newGroupIdContainer);
    var newGroupIdLabel = document.createElement("label");
    newGroupIdLabel.setAttribute("for","mass_new_group_id");
    newGroupIdLabel.classList.add("col-sm-3", "control-label");
    newGroupIdLabel.innerText = "New group IDs";
    newGroupIdContainer.appendChild(newGroupIdLabel);
    var newGroupIdFieldContainer = document.createElement("div");
    newGroupIdFieldContainer.classList.add("col-sm-9");
    newGroupIdContainer.appendChild(newGroupIdFieldContainer);
    var newGroupIdField = document.createElement("textarea");
    newGroupIdField.setAttribute("id", "mass_new_chapter_number");
    newGroupIdField.setAttribute("name", "mass_new_chapter_number");
    newGroupIdField.setAttribute("placeholder", "chapter1\nchapter2\nchapter3");
    newGroupIdField.classList.add("form-control");
    newGroupIdField.style.height = "120px";
    newGroupIdFieldContainer.appendChild(newGroupIdField);

    //create new group2id field
    var newGroup2IdContainer = document.createElement("div");
    newGroup2IdContainer.classList.add("form-group");
    massEditForm.appendChild(newGroup2IdContainer);
    var newGroup2IdLabel = document.createElement("label");
    newGroup2IdLabel.setAttribute("for","mass_new_group_2_id");
    newGroup2IdLabel.classList.add("col-sm-3", "control-label");
    newGroup2IdLabel.innerText = "New group 2 IDs";
    newGroup2IdContainer.appendChild(newGroup2IdLabel);
    var newGroup2IdFieldContainer = document.createElement("div");
    newGroup2IdFieldContainer.classList.add("col-sm-9");
    newGroup2IdContainer.appendChild(newGroup2IdFieldContainer);
    var newGroup2IdField = document.createElement("textarea");
    newGroup2IdField.setAttribute("id", "mass_new_group_2_id");
    newGroup2IdField.setAttribute("name", "mass_new_group_2_id");
    newGroup2IdField.setAttribute("placeholder", "chapter1\nchapter2\nchapter3");
    newGroup2IdField.classList.add("form-control");
    newGroup2IdField.style.height = "120px";
    newGroup2IdFieldContainer.appendChild(newGroup2IdField);

    //create new group3id field
    var newGroup3IdContainer = document.createElement("div");
    newGroup3IdContainer.classList.add("form-group");
    massEditForm.appendChild(newGroup3IdContainer);
    var newGroup3IdLabel = document.createElement("label");
    newGroup3IdLabel.setAttribute("for","mass_new_group_3_id");
    newGroup3IdLabel.classList.add("col-sm-3", "control-label");
    newGroup3IdLabel.innerText = "New group 3 IDs";
    newGroup3IdContainer.appendChild(newGroup3IdLabel);
    var newGroup3IdFieldContainer = document.createElement("div");
    newGroup3IdFieldContainer.classList.add("col-sm-9");
    newGroup3IdContainer.appendChild(newGroup3IdFieldContainer);
    var newGroup3IdField = document.createElement("textarea");
    newGroup3IdField.setAttribute("id", "mass_new_group_3_id");
    newGroup3IdField.setAttribute("name", "mass_new_group_3_id");
    newGroup3IdField.setAttribute("placeholder", "chapter1\nchapter2\nchapter3");
    newGroup3IdField.classList.add("form-control");
    newGroup3IdField.style.height = "120px";
    newGroup3IdFieldContainer.appendChild(newGroup3IdField);

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
    var previewButton = document.createElement("button");
    previewButton.setAttribute("id", "mass_edit_preview_button");
    previewButton.setAttribute("type", "button");
    previewButton.classList.add("btn", "btn-info", "pull-right");
    buttonsDiv.appendChild(previewButton);
    var previewButtonIcon = document.createElement("span");
    previewButtonIcon.classList.add("fas", "fa-eye", "fa-fw");
    previewButtonIcon.style.marginRight = "3px";
    previewButton.appendChild(previewButtonIcon);
    var previewButtonText = document.createElement("span");
    previewButtonText.classList.add("span-1280");
    previewButtonText.innerText = "Preview Edit";
    previewButton.appendChild(previewButtonText);
    editButton.addEventListener("click", function(event)
                                        {
                                            massEdit([chapterTitleToEditField.value, volumeNumberToEditField.value, chapterNumberToEditField.value, languageToEditField.value, groupIdToEditField.value, group2IdToEditField.value, group3IdToEditField.value, newChapterTitleField.value, newVolumeNumberField.value, newChapterNumberField.value, newLanguageField.value, newGroupIdField.value, newGroup2IdField.value, newGroup3IdField.value]);
                                        });
    cancelButton.addEventListener("click", function()
                                            {
                                                massEditForm.reset();
                                                massEditForm.style.display = "none";
                                                mangaInfo.style.display =  "block";
                                            });
    previewButton.addEventListener("click", function(event)
                                        {
                                            previewEdit([chapterTitleToEditField.value, volumeNumberToEditField.value, chapterNumberToEditField.value, languageToEditField.value, groupIdToEditField.value, group2IdToEditField.value, group3IdToEditField.value, newChapterTitleField.value, newVolumeNumberField.value, newChapterNumberField.value, newLanguageField.value, newGroupIdField.value, newGroup2IdField.value, newGroup3IdField.value]);
                                        });

    //add preview table
    var editPreviewTable = document.createElement("table");
    editPreviewTable.classList.add("table", "table-hover", "table-striped", "table-condensed");
    massEditForm.appendChild(editPreviewTable);
    var editPreviewTableBody = document.createElement("tbody");
    editPreviewTableBody.id = "edit_preview";
    editPreviewTable.appendChild(editPreviewTableBody);

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

function previewEdit(fields)
{
    const flags =
    {
        "English":"gb",
        "Japanese":"jp",
        "Polish":"po",
        "Serbo-Croatian":"rs",
        "Dutch":"nl",
        "Italian":"it",
        "Russian":"ru",
        "German":"de",
        "Hungarian":"hu",
        "French":"fr",
        "Finnish":"fi",
        "Vietnamese":"vn",
        "Greek":"gr",
        "Bulgarian":"bg",
        "Spanish (Es)":"es",
        "Portuguese (Br)":"br",
        "Portuguese (Pt)":"pt",
        "Swedish":"se",
        "Arabic":"sa",
        "Danish":"dk",
        "Chinese (Simp)":"cn",
        "Bengali":"bd",
        "Romanian":"ro",
        "Czech":"cz",
        "Mongolian":"mn",
        "Turkish":"tr",
        "Indonesian":"id",
        "Korean":"kr",
        "Spanish (LATAM)":"mx",
        "Persian":"ir",
        "Malaysian":"my",
        "Thai":"th",
        "Catalan":"ct",
        "Filipino":"ph",
        "Chinese (Trad)":"hk"
    };

    const oldChapterTitles = fields[0].split("\n");
    const oldVolumeNumbers = fields[1].split("\n");
    const oldChapterNumbers = fields[2].split("\n");
    const oldLanguages = fields[3].split("\n");
    const oldGroups = fields[4].split("\n");
    const oldGroups2 = fields[5].split("\n");
    const oldGroups3 = fields[6].split("\n");
    const newChapterTitles = fields[7].split("\n");
    const newVolumeNumbers = fields[8].split("\n");
    const newChapterNumbers = fields[9].split("\n");
    const newLanguages = fields[10].split("\n");
    const newGroups = fields[11].split("\n");
    const newGroups2 = fields[12].split("\n");
    const newGroups3 = fields[13].split("\n");

    const previewTable = document.getElementById("edit_preview");

    while (previewTable.firstChild) //delete current preview
    {
        previewTable.removeChild(previewTable.firstChild);
    }

    var i = 0;
    $('a[href*="/chapter/"').each(function (chapter)
                                    {
                                        var title = "";
                                        if ($(this).get(0).getAttribute('data-chapter-name') == "")
                                        {
                                            title = "Read Online";
                                        }
                                        else
                                        {
                                            title = $(this).get(0).getAttribute('data-chapter-name');
                                        }
                                        const volNum = $(this).get(0).getAttribute('data-volume-num');
                                        const chapNum = $(this).get(0).getAttribute('data-chapter-num');
                                        const langTitle = $(this).closest('tr').find('img[src*="/images/flags/"]')[0].title;
                                        const groupId = $(this).closest('tr').find('a[href*="/group/"]')[0].href.match(/(\d+)/)[0];
                                        var group2Id = "0";
                                        var group3Id = "0";
                                        if($(this).closest('tr').find('a[href*="/group/"]').length > 1)
                                        {
                                            group2Id = $(this).closest('tr').find('a[href*="/group/"]')[1].href.match(/(\d+)/)[0];
                                        }
                                        if($(this).closest('tr').find('a[href*="/group/"]').length > 2)
                                        {
                                            group3Id = $(this).closest('tr').find('a[href*="/group/"]')[2].href.match(/(\d+)/)[0];
                                        }
                                        if((oldChapterTitles.includes(title) || (oldChapterTitles.length == 1 && oldChapterTitles[0] == "")) && (oldChapterNumbers.includes(chapNum) || (oldChapterNumbers.length == 1 && oldChapterNumbers[0] == "")) && (oldVolumeNumbers.includes(volNum) || (oldVolumeNumbers.length == 1 && oldVolumeNumbers[0] == "")) && (oldLanguages.includes(langTitle) || (oldLanguages.length == 1 && oldLanguages[0] == "")) && (oldGroups.includes(groupId) || (oldGroups.length == 1 && oldGroups[0] == "")) && (oldGroups2.includes(group2Id) || (oldGroups2.length == 1 && oldGroups2[0] == "")) && (oldGroups3.includes(group3Id) || (oldGroups3.length == 1 && oldGroups3[0] == ""))) //only push chapters in list
                                        {
                                            var editPreviewOld = this.parentNode.parentNode.cloneNode(true);
                                            editPreviewOld.childNodes[1].innerHTML = "<span class='fas fa-strikethrough' aria-hidden='true' title=''></span>";
                                            previewTable.appendChild(editPreviewOld);
                                            var editPreviewNew = this.parentNode.parentNode.cloneNode(true);
                                            editPreviewNew.childNodes[1].innerHTML = "<span class='fas fa-pencil-alt' aria-hidden='true' title=''></span>";
                                            var chapterTitlePreview;
                                            if(newChapterTitles.length == 1 && newChapterTitles[0] == "")
                                            {
                                                chapterTitlePreview = title;
                                            }
                                            else
                                            {
                                                chapterTitlePreview = newChapterTitles[i] || title;
                                            }
                                            var volumeNumberPreview;
                                            if(newVolumeNumbers.length == 1 && newVolumeNumbers[0] == "")
                                            {
                                                volumeNumberPreview = volNum;
                                            }
                                            else
                                            {
                                                volumeNumberPreview = newVolumeNumbers[i] || volNum;
                                            }
                                            var chapterNumberPreview;
                                            if(newChapterNumbers.length == 1 && newChapterNumbers == "")
                                            {
                                                chapterNumberPreview = chapNum;
                                            }
                                            else
                                            {
                                                chapterNumberPreview = newChapterNumbers[i] || chapNum;
                                            }
                                            var languagePreview;
                                            if(newLanguages.length == 1 && newLanguages[0] == "")
                                            {
                                                languagePreview = langTitle;
                                            }
                                            else
                                            {
                                                languagePreview = newLanguages[i] || langTitle;
                                            }
                                            var groupPreview;
                                            if(newGroups.length == 1 && newGroups[0] == "")
                                            {
                                                groupPreview = groupId;
                                            }
                                            else
                                            {
                                                groupPreview = newGroups[i] || groupId;
                                            }
                                            var group2Preview;
                                            if(newGroups2.length == 1 && newGroups2[0] == "")
                                            {
                                                group2Preview = group2Id;
                                            }
                                            else
                                            {
                                                group2Preview = newGroups2[i] || group2Id;
                                            }
                                            var group3Preview;
                                            if(newGroups3.length == 1 && newGroups3[0] == "")
                                            {
                                                group3Preview = group3Id;
                                            }
                                            else
                                            {
                                                group3Preview = newGroups3[i] || group3Id;
                                            }

                                            //fill in new preview
                                            editPreviewNew.childNodes[3].innerText = "";
                                            if(volumeNumberPreview != "")
                                            {
                                                editPreviewNew.childNodes[3].innerText += "Vol. " +  volumeNumberPreview;
                                            }
                                            if(chapterNumberPreview != "")
                                            {
                                                editPreviewNew.childNodes[3].innerText += " Ch. " + chapterNumberPreview;
                                            }
                                            if(editPreviewNew.childNodes[3].innerText != "")
                                            {
                                                editPreviewNew.childNodes[3].innerText +=  " - ";
                                            }
                                            editPreviewNew.childNodes[5].childNodes[0].setAttribute("src", "https://s1.mangadex.org/images/flags/" + flags[languagePreview] + ".png");
                                            editPreviewNew.childNodes[5].childNodes[0].setAttribute("alt", languagePreview);
                                            editPreviewNew.childNodes[5].childNodes[0].setAttribute("title", languagePreview);
                                            editPreviewNew.childNodes[7].innerHTML = "<a href='/group/" + groupPreview + "'>" + groupPreview + "</a>";
                                            if(group2Preview != "" && group2Preview != 0)
                                            {
                                                editPreviewNew.childNodes[7].innerHTML += " | <a href='/group/" + group2Preview + "'>" + group2Preview + "</a>";
                                            }
                                            if(group3Preview != "" && group3Preview != 0)
                                            {
                                                editPreviewNew.childNodes[7].innerHTML += " | <a href='/group/" + group3Preview + "'>" + group3Preview + "</a>";
                                            }


                                            previewTable.appendChild(editPreviewNew);
                                            i++;
                                        }
                                    });
}

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
        "Spanish (Es)":"15",
        "Portuguese (Br)":"16",
        "Portuguese (Pt)":"17",
        "Swedish":"18",
        "Arabic":"19",
        "Danish":"20",
        "Chinese (Simp)":"21",
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
        "Catalan":"33",
        "Filipino":"34",
        "Chinese (Trad)":"35"
    };

    const manga = (/\/(\d+)/g).exec(window.location.href)[1];

	//List of chapters to edit
    let toEdit = [];

    // good place to put some data:
    const oldChapterTitles = fields[0].split("\n");
    const oldVolumeNumbers = fields[1].split("\n");
    const oldChapterNumbers = fields[2].split("\n");
    const oldLanguages = fields[3].split("\n");
    const oldGroups = fields[4].split("\n");
    const newChapterTitles = fields[5].split("\n");
    const newVolumeNumbers = fields[6].split("\n");
    const newChapterNumbers = fields[7].split("\n");
    const newLanguages = fields[8].split("\n");
    const newGroups = fields[9].split("\n");

    const previewTable = document.getElementById("edit_preview");

    while (previewTable.firstChild) //delete current preview because function below will get it and submit everything twice so probably fix this properly later
    {
        previewTable.removeChild(previewTable.firstChild);
    }

    $('a[href*="/chapter/"').each(function (chapter)
                                    {

                                        const title = $(this).get(0).getAttribute('data-chapter-name');
                                        const volNum = $(this).get(0).getAttribute('data-volume-num');
                                        const chapNum = $(this).get(0).getAttribute('data-chapter-num');
                                        if((oldChapterTitles.includes(title) || (oldChapterTitles.length == 1 && oldChapterTitles[0] == "") || (title == "" && oldChapterTitles.includes("Read Online"))) && (oldChapterNumbers.includes(chapNum) || (oldChapterNumbers.length == 1 && oldChapterNumbers[0] == "")) && (oldVolumeNumbers.includes(volNum) || (oldVolumeNumbers.length == 1 && oldVolumeNumbers[0] == ""))) //only push chapters in list
                                        {
                                            const chapId = $(this).get(0).href.match(/(\d+)/)[0];
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
    for (let i = 0, len = toEdit.length; i < len; i++)
    {
        console.log("Processing chapter #" + (i+1) + " of " + len);
        // data format 0:chapId 1:volNum 2:chapNum 3:title 4:groupId 5:group2Id 6:group3Id 7:langTitle 8:file(optional)
        var oldData = toEdit[i];
        var newData = oldData.slice(0);

        // oldData holds the current information for the chapter. Don't change it
        // make your changes to newData, which is a clone of oldData by default
        // --- CHANGES TO DATA HERE ---
        //if there are no new values use old
        if(newVolumeNumbers.length == 1 && newVolumeNumbers[0] == "")
        {
            newData[1] = oldData[1];
        }
        else
        {
            newData[1] = newVolumeNumbers[i] || oldData[1];
        }
        if(newChapterNumbers.length == 1 && newChapterNumbers[0] == "")
        {
            newData[2] = oldData[2];
        }
        else
        {
            newData[2] = newChapterNumbers[i] || oldData[2];
        }
        if(newChapterTitles.length == 1 && newChapterTitles[0] == "")
        {
            newData[3] = oldData[1];
        }
        else
        {
            newData[3] = newChapterTitles[i] || oldData[3];
        }

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