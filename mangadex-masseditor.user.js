// ==UserScript==
// @name         MangaDex (shitty) Mass Editor
// @namespace    https://github.com/LucasPratas/userscripts
// @version      0.93
// @icon         https://mangadex.org/favicon.ico
// @description  stop robo from nuking untitled chapters by ripping off bcvxy's script
// @author       bcvxy, Xnot
// @updateURL    https://github.com/LucasPratas/userscripts/raw/master/mangadex-masseditor.user.js
// @downloadURL  https://github.com/LucasPratas/userscripts/raw/master/mangadex-masseditor.user.js
// @include      https://*mangadex.org/manga/*
// @grant        none
// ==/UserScript==

function createForm() //creates mass edit form
{
    const massEditForm = document.createElement("form");
    massEditForm.setAttribute("id", "mass_edit_form");
    massEditForm.classList.add("form-horizontal", "panel-body");
    massEditForm.style.display = "none";
    const container = document.getElementById("content").getElementsByClassName("panel panel-default")[0];
    const mangaInfo = container.getElementsByClassName("row edit")[0];
    container.appendChild(massEditForm);

    const userscriptInfo = document.createElement("div"); //info panel with userscript instructions
    userscriptInfo.classList.add("alert", "alert-info");
    userscriptInfo.setAttribute("role", "alert");
    userscriptInfo.innerHTML = "<h4>You are using MangaDex (shitty) Mass Editor ßeta by Xnot with some code borrowed from bcvxy</h4>" +
        "<ol><li>Use the 'to edit' fields to grab the chapters you want. Each line is one value" +
        "<br />Use 'Read Online' to grab empty titles, ' ' (a space) to grab empty chapter/volume numbers, and '0' to grab empty groups2/3" +
        "<br />Only chapters in the page you are looking at can be grabbed" +
        "<br />Filling in multiple 'to edit' fields will grab chapters that match both. For example filling titles with 'Read Online' and volume with '4' and '2' will grab all chapters titled 'Read Online' in volumes 4 and 2" +
        "<br />Empty 'to edit' fields are ignored" +
        "<li>The 'new' fields determine the new values for the grabbed chapters top to bottom" +
        "<br />Use ' ' to delete titles and chapter/volume numbers, and '0' to delete groups2/3" +
        "<li>Use the preview button if you feel so inclined" +
        "<li>Press the Apply Edit button and wait until it's all cool and good" +
        "<li>Refresh after every edit so you aren't editing based on outdated information." +
        "<li>Editing <strike>groups, languages and</strike> files soon™ maybe</ol>" +
    "If there are any problems @ or pm me on Discord<br />" +
    "Update 0.80:" +
        "<ul><li>Inputting a single value in the 'new' fields now uses that value for all edits" +
        "<li>Chapters with no chapter/volume number are now grabbable with ' '</ul>" +
    "Update 0.90:" +
        "<ul><li>Added file editing" +
        "<li>The files will be in alphabetical order when you hover the button, but are actually reversed when applying edit to match the top to bottom format" +
        "<li>Also make sure you want to replace the file of all grabbed chapters because there's no way to skip grabbed chapters with file editing right now" +
        "<li>Fixed previews which chapter comment update broke</ul>";
    massEditForm.appendChild(userscriptInfo); //insert info panel

    document.getElementById("message_container").classList.replace("display-none", "display-block");

    //create chapter title to edit field
    const chapterTitleToEditContainer = document.createElement("div");
    chapterTitleToEditContainer.classList.add("form-group");
    massEditForm.appendChild(chapterTitleToEditContainer);
    const chapterTitleToEditToggle = document.createElement("a");
    chapterTitleToEditToggle.setAttribute("data-toggle", "collapse");
    chapterTitleToEditToggle.setAttribute("data-target", "#mass_chapter_title_to_edit");
    chapterTitleToEditContainer.appendChild(chapterTitleToEditToggle);
    const chapterTitleToEditLabel = document.createElement("label");
    chapterTitleToEditLabel.setAttribute("for","mass_chapter_title_to_edit");
    chapterTitleToEditLabel.classList.add("col-sm-3", "control-label");
    chapterTitleToEditLabel.innerText = "Chapter titles to edit";
    chapterTitleToEditToggle.appendChild(chapterTitleToEditLabel);
    const chapterTitleToEditToggleIcon = document.createElement("span");
    chapterTitleToEditToggleIcon.classList.add("fas", "fa-angle-down", "fa-fw");
    chapterTitleToEditLabel.appendChild(chapterTitleToEditToggleIcon);
    const chapterTitleToEditFieldContainer = document.createElement("div");
    chapterTitleToEditFieldContainer.classList.add("col-sm-9");
    chapterTitleToEditContainer.appendChild(chapterTitleToEditFieldContainer);
    const chapterTitleToEditField = document.createElement("textarea");
    chapterTitleToEditField.setAttribute("id", "mass_chapter_title_to_edit");
    chapterTitleToEditField.setAttribute("name", "mass_chapter_title_to_edit");
    chapterTitleToEditField.setAttribute("placeholder", "Read Online\nRead Offline\nPlaceholder3");
    chapterTitleToEditField.classList.add("form-control", "collapse", "in");
    chapterTitleToEditField.style.height = "80px";
    chapterTitleToEditFieldContainer.appendChild(chapterTitleToEditField);
    $(chapterTitleToEditField).on("hidden.bs.collapse", function(event)
                                                        {
                                                            chapterTitleToEditToggleIcon.classList.replace("fa-angle-down", "fa-angle-right");
                                                        });
    $(chapterTitleToEditField).on("shown.bs.collapse", function(event)
                                                        {
                                                            chapterTitleToEditToggleIcon.classList.replace("fa-angle-right", "fa-angle-down");
                                                            this.style.height = "80px";
                                                        });

    //create volume number to edit field
    const volumeNumberToEditContainer = document.createElement("div");
    volumeNumberToEditContainer.classList.add("form-group");
    massEditForm.appendChild(volumeNumberToEditContainer);
    const volumeNumberToEditToggle = document.createElement("a");
    volumeNumberToEditToggle.setAttribute("data-toggle", "collapse");
    volumeNumberToEditToggle.setAttribute("data-target", "#mass_volume_number_to_edit");
    volumeNumberToEditContainer.appendChild(volumeNumberToEditToggle);
    const volumeNumberToEditLabel = document.createElement("label");
    volumeNumberToEditLabel.setAttribute("for","mass_volume_number_to_edit");
    volumeNumberToEditLabel.classList.add("col-sm-3", "control-label");
    volumeNumberToEditLabel.innerText = "Volume numbers to edit";
    volumeNumberToEditToggle.appendChild(volumeNumberToEditLabel);
    const volumeNumberToEditToggleIcon = document.createElement("span");
    volumeNumberToEditToggleIcon.classList.add("fas", "fa-angle-down", "fa-fw");
    volumeNumberToEditLabel.appendChild(volumeNumberToEditToggleIcon);
    const volumeNumberToEditFieldContainer = document.createElement("div");
    volumeNumberToEditFieldContainer.classList.add("col-sm-9");
    volumeNumberToEditContainer.appendChild(volumeNumberToEditFieldContainer);
    const volumeNumberToEditField = document.createElement("textarea");
    volumeNumberToEditField.setAttribute("id", "mass_volume_number_to_edit");
    volumeNumberToEditField.setAttribute("name", "mass_volume_number_to_edit");
    volumeNumberToEditField.setAttribute("placeholder", "1\n2\n3");
    volumeNumberToEditField.classList.add("form-control", "collapse", "in");
    volumeNumberToEditField.style.height = "80px";
    volumeNumberToEditFieldContainer.appendChild(volumeNumberToEditField);
    $(volumeNumberToEditField).on("hidden.bs.collapse", function(event)
                                                        {
                                                            volumeNumberToEditToggleIcon.classList.replace("fa-angle-down", "fa-angle-right");
                                                        });
    $(volumeNumberToEditField).on("shown.bs.collapse", function(event)
                                                        {
                                                            volumeNumberToEditToggleIcon.classList.replace("fa-angle-right", "fa-angle-down");
                                                            this.style.height = "80px";
                                                        });

    //create chapter number to edit field
    const chapterNumberToEditContainer = document.createElement("div");
    chapterNumberToEditContainer.classList.add("form-group");
    massEditForm.appendChild(chapterNumberToEditContainer);
    const chapterNumberToEditToggle = document.createElement("a");
    chapterNumberToEditToggle.setAttribute("data-toggle", "collapse");
    chapterNumberToEditToggle.setAttribute("data-target", "#mass_chapter_number_to_edit");
    chapterNumberToEditContainer.appendChild(chapterNumberToEditToggle);
    const chapterNumberToEditLabel = document.createElement("label");
    chapterNumberToEditLabel.setAttribute("for","mass_chapter_number_to_edit");
    chapterNumberToEditLabel.classList.add("col-sm-3", "control-label");
    chapterNumberToEditLabel.innerText = "Chapter numbers to edit";
    chapterNumberToEditToggle.appendChild(chapterNumberToEditLabel);
    const chapterNumberToEditToggleIcon = document.createElement("span");
    chapterNumberToEditToggleIcon.classList.add("fas", "fa-angle-down", "fa-fw");
    chapterNumberToEditLabel.appendChild(chapterNumberToEditToggleIcon);
    const chapterNumberToEditFieldContainer = document.createElement("div");
    chapterNumberToEditFieldContainer.classList.add("col-sm-9");
    chapterNumberToEditContainer.appendChild(chapterNumberToEditFieldContainer);
    const chapterNumberToEditField = document.createElement("textarea");
    chapterNumberToEditField.setAttribute("id", "mass_chapter_number_to_edit");
    chapterNumberToEditField.setAttribute("name", "mass_chapter_number_to_edit");
    chapterNumberToEditField.setAttribute("placeholder", "1\n2\n3");
    chapterNumberToEditField.classList.add("form-control", "collapse", "in");
    chapterNumberToEditField.style.height = "80px";
    chapterNumberToEditFieldContainer.appendChild(chapterNumberToEditField);
    $(chapterNumberToEditField).on("hidden.bs.collapse", function(event)
                                                        {
                                                            chapterNumberToEditToggleIcon.classList.replace("fa-angle-down", "fa-angle-right");
                                                        });
    $(chapterNumberToEditField).on("shown.bs.collapse", function(event)
                                                        {
                                                            chapterNumberToEditToggleIcon.classList.replace("fa-angle-right", "fa-angle-down");
                                                            this.style.height = "80px";
                                                        });

    //create language to edit field
    const languageToEditContainer = document.createElement("div");
    languageToEditContainer.classList.add("form-group");
    massEditForm.appendChild(languageToEditContainer);
    const languageToEditToggle = document.createElement("a");
    languageToEditToggle.setAttribute("data-toggle", "collapse");
    languageToEditToggle.setAttribute("data-target", "#mass_language_to_edit");
    languageToEditContainer.appendChild(languageToEditToggle);
    const languageToEditLabel = document.createElement("label");
    languageToEditLabel.setAttribute("for","mass_language_to_edit");
    languageToEditLabel.classList.add("col-sm-3", "control-label");
    languageToEditLabel.innerText = "Languages to edit";
    languageToEditToggle.appendChild(languageToEditLabel);
    const languageToEditToggleIcon = document.createElement("span");
    languageToEditToggleIcon.classList.add("fas", "fa-angle-right", "fa-fw");
    languageToEditLabel.appendChild(languageToEditToggleIcon);
    const languageToEditFieldContainer = document.createElement("div");
    languageToEditFieldContainer.classList.add("col-sm-9");
    languageToEditContainer.appendChild(languageToEditFieldContainer);
    const languageToEditField = document.createElement("textarea");
    languageToEditField.setAttribute("id", "mass_language_to_edit");
    languageToEditField.setAttribute("name", "mass_language_to_edit");
    languageToEditField.setAttribute("placeholder", "English\nSpanish (Es)\nPortuguese (Br)");
    languageToEditField.classList.add("form-control", "collapse");
    languageToEditField.style.height = "35px";
    languageToEditFieldContainer.appendChild(languageToEditField);
    $(languageToEditField).on("hidden.bs.collapse", function(event)
                                                    {
                                                        languageToEditToggleIcon.classList.replace("fa-angle-down", "fa-angle-right");
                                                    });
    $(languageToEditField).on("shown.bs.collapse", function(event)
                                                    {
                                                        languageToEditToggleIcon.classList.replace("fa-angle-right", "fa-angle-down");
                                                        this.style.height = "80px";
                                                    });

    //create groupid to edit field
    const groupIdToEditContainer = document.createElement("div");
    groupIdToEditContainer.classList.add("form-group");
    massEditForm.appendChild(groupIdToEditContainer);
    const groupIdToEditToggle = document.createElement("a");
    groupIdToEditToggle.setAttribute("data-toggle", "collapse");
    groupIdToEditToggle.setAttribute("data-target", "#mass_group_id_to_edit");
    groupIdToEditContainer.appendChild(groupIdToEditToggle);
    const groupIdToEditLabel = document.createElement("label");
    groupIdToEditLabel.setAttribute("for","mass_group_id_to_edit");
    groupIdToEditLabel.classList.add("col-sm-3", "control-label");
    groupIdToEditLabel.innerText = "Group IDs to edit";
    groupIdToEditToggle.appendChild(groupIdToEditLabel);
    const groupIdToEditToggleIcon = document.createElement("span");
    groupIdToEditToggleIcon.classList.add("fas", "fa-angle-down", "fa-fw");
    groupIdToEditLabel.appendChild(groupIdToEditToggleIcon);
    const groupIdToEditFieldContainer = document.createElement("div");
    groupIdToEditFieldContainer.classList.add("col-sm-9");
    groupIdToEditContainer.appendChild(groupIdToEditFieldContainer);
    const groupIdToEditField = document.createElement("textarea");
    groupIdToEditField.setAttribute("id", "mass_group_id_to_edit");
    groupIdToEditField.setAttribute("name", "mass_group_id_to_edit");
    groupIdToEditField.setAttribute("placeholder", "1\n2\n3");
    groupIdToEditField.classList.add("form-control", "collapse", "in");
    groupIdToEditField.style.height = "80px";
    groupIdToEditFieldContainer.appendChild(groupIdToEditField);
    $(groupIdToEditField).on("hidden.bs.collapse", function(event)
                                                    {
                                                        groupIdToEditToggleIcon.classList.replace("fa-angle-down", "fa-angle-right");
                                                    });
    $(groupIdToEditField).on("shown.bs.collapse", function(event)
                                                    {
                                                        groupIdToEditToggleIcon.classList.replace("fa-angle-right", "fa-angle-down");
                                                        this.style.height = "80px";
                                                    });

    //create group2id to edit field
    const group2IdToEditContainer = document.createElement("div");
    group2IdToEditContainer.classList.add("form-group");
    massEditForm.appendChild(group2IdToEditContainer);
    const group2IdToEditToggle = document.createElement("a");
    group2IdToEditToggle.setAttribute("data-toggle", "collapse");
    group2IdToEditToggle.setAttribute("data-target", "#mass_group_2_id_to_edit");
    group2IdToEditContainer.appendChild(group2IdToEditToggle);
    const group2IdToEditLabel = document.createElement("label");
    group2IdToEditLabel.setAttribute("for","mass_group_2_id_to_edit");
    group2IdToEditLabel.classList.add("col-sm-3", "control-label");
    group2IdToEditLabel.innerText = "Group 2 IDs to edit";
    group2IdToEditToggle.appendChild(group2IdToEditLabel);
    const group2IdToEditToggleIcon = document.createElement("span");
    group2IdToEditToggleIcon.classList.add("fas", "fa-angle-right", "fa-fw");
    group2IdToEditLabel.appendChild(group2IdToEditToggleIcon);
    const group2IdToEditFieldContainer = document.createElement("div");
    group2IdToEditFieldContainer.classList.add("col-sm-9");
    group2IdToEditContainer.appendChild(group2IdToEditFieldContainer);
    const group2IdToEditField = document.createElement("textarea");
    group2IdToEditField.setAttribute("id", "mass_group_2_id_to_edit");
    group2IdToEditField.setAttribute("name", "mass_group_2_id_to_edit");
    group2IdToEditField.setAttribute("placeholder", "1\n2\n3");
    group2IdToEditField.classList.add("form-control", "collapse");
    group2IdToEditField.style.height = "35px";
    group2IdToEditFieldContainer.appendChild(group2IdToEditField);
    $(group2IdToEditField).on("hidden.bs.collapse", function(event)
                                                    {
                                                        group2IdToEditToggleIcon.classList.replace("fa-angle-down", "fa-angle-right");
                                                    });
    $(group2IdToEditField).on("shown.bs.collapse", function(event)
                                                    {
                                                        group2IdToEditToggleIcon.classList.replace("fa-angle-right", "fa-angle-down");
                                                        this.style.height = "80px";
                                                    });

    //create group3id to edit field
    const group3IdToEditContainer = document.createElement("div");
    group3IdToEditContainer.classList.add("form-group");
    massEditForm.appendChild(group3IdToEditContainer);
    const group3IdToEditToggle = document.createElement("a");
    group3IdToEditToggle.setAttribute("data-toggle", "collapse");
    group3IdToEditToggle.setAttribute("data-target", "#mass_group_3_id_to_edit");
    group3IdToEditContainer.appendChild(group3IdToEditToggle);
    const group3IdToEditLabel = document.createElement("label");
    group3IdToEditLabel.setAttribute("for","mass_group_3_id_to_edit");
    group3IdToEditLabel.classList.add("col-sm-3", "control-label");
    group3IdToEditLabel.innerText = "Group 3 IDs to edit";
    group3IdToEditToggle.appendChild(group3IdToEditLabel);
    const group3IdToEditToggleIcon = document.createElement("span");
    group3IdToEditToggleIcon.classList.add("fas", "fa-angle-right", "fa-fw");
    group3IdToEditLabel.appendChild(group3IdToEditToggleIcon);
    const group3IdToEditFieldContainer = document.createElement("div");
    group3IdToEditFieldContainer.classList.add("col-sm-9");
    group3IdToEditContainer.appendChild(group3IdToEditFieldContainer);
    const group3IdToEditField = document.createElement("textarea");
    group3IdToEditField.setAttribute("id", "mass_group_3_id_to_edit");
    group3IdToEditField.setAttribute("name", "mass_group_3_id_to_edit");
    group3IdToEditField.setAttribute("placeholder", "1\n2\n3");
    group3IdToEditField.classList.add("form-control", "collapse");
    group3IdToEditField.style.height = "35px";
    group3IdToEditFieldContainer.appendChild(group3IdToEditField);
    $(group3IdToEditField).on("hidden.bs.collapse", function(event)
                                                    {
                                                        group3IdToEditToggleIcon.classList.replace("fa-angle-down", "fa-angle-right");
                                                    });
    $(group3IdToEditField).on("shown.bs.collapse", function(event)
                                                    {
                                                        group3IdToEditToggleIcon.classList.replace("fa-angle-right", "fa-angle-down");
                                                        this.style.height = "80px";
                                                    });

    //create new chapter title field
    const newChapterTitleContainer = document.createElement("div");
    newChapterTitleContainer.classList.add("form-group");
    massEditForm.appendChild(newChapterTitleContainer);
    const newChapterTitleToggle = document.createElement("a");
    newChapterTitleToggle.setAttribute("data-toggle", "collapse");
    newChapterTitleToggle.setAttribute("data-target", "#mass_new_chapter_title");
    newChapterTitleContainer.appendChild(newChapterTitleToggle);
    const newChapterTitleLabel = document.createElement("label");
    newChapterTitleLabel.setAttribute("for","mass_new_chapter_title");
    newChapterTitleLabel.classList.add("col-sm-3", "control-label");
    newChapterTitleLabel.innerText = "New chapter titles";
    newChapterTitleToggle.appendChild(newChapterTitleLabel);
    const newChapterTitleToggleIcon = document.createElement("span");
    newChapterTitleToggleIcon.classList.add("fas", "fa-angle-down", "fa-fw");
    newChapterTitleLabel.appendChild(newChapterTitleToggleIcon);
    const newChapterTitleFieldContainer = document.createElement("div");
    newChapterTitleFieldContainer.classList.add("col-sm-9");
    newChapterTitleContainer.appendChild(newChapterTitleFieldContainer);
    const newChapterTitleField = document.createElement("textarea");
    newChapterTitleField.setAttribute("id", "mass_new_chapter_title");
    newChapterTitleField.setAttribute("name", "mass_new_chapter_title");
    newChapterTitleField.setAttribute("placeholder", "title1\ntitle2\ntitle3");
    newChapterTitleField.classList.add("form-control", "collapse", "in");
    newChapterTitleField.style.height = "80px";
    newChapterTitleFieldContainer.appendChild(newChapterTitleField);
    $(newChapterTitleField).on("hidden.bs.collapse", function(event)
                                                    {
                                                        newChapterTitleToggleIcon.classList.replace("fa-angle-down", "fa-angle-right");
                                                    });
    $(newChapterTitleField).on("shown.bs.collapse", function(event)
                                                    {
                                                        newChapterTitleToggleIcon.classList.replace("fa-angle-right", "fa-angle-down");
                                                        this.style.height = "80px";
                                                    });

    //create new volume number field
    const newVolumeNumberContainer = document.createElement("div");
    newVolumeNumberContainer.classList.add("form-group");
    massEditForm.appendChild(newVolumeNumberContainer);
    const newVolumeNumberToggle = document.createElement("a");
    newVolumeNumberToggle.setAttribute("data-toggle", "collapse");
    newVolumeNumberToggle.setAttribute("data-target", "#mass_new_volume_number");
    newVolumeNumberContainer.appendChild(newVolumeNumberToggle);
    const newVolumeNumberLabel = document.createElement("label");
    newVolumeNumberLabel.setAttribute("for","mass_new_volume_number");
    newVolumeNumberLabel.classList.add("col-sm-3", "control-label");
    newVolumeNumberLabel.innerText = "New volume numbers";
    newVolumeNumberToggle.appendChild(newVolumeNumberLabel);
    const newVolumeNumberToggleIcon = document.createElement("span");
    newVolumeNumberToggleIcon.classList.add("fas", "fa-angle-down", "fa-fw");
    newVolumeNumberLabel.appendChild(newVolumeNumberToggleIcon);
    const newVolumeNumberFieldContainer = document.createElement("div");
    newVolumeNumberFieldContainer.classList.add("col-sm-9");
    newVolumeNumberContainer.appendChild(newVolumeNumberFieldContainer);
    const newVolumeNumberField = document.createElement("textarea");
    newVolumeNumberField.setAttribute("id", "mass_new_volume_number");
    newVolumeNumberField.setAttribute("name", "mass_new_volume_number");
    newVolumeNumberField.setAttribute("placeholder", "volume1\nvolume2\nvolume3");
    newVolumeNumberField.classList.add("form-control", "collapse", "in");
    newVolumeNumberField.style.height = "80px";
    newVolumeNumberFieldContainer.appendChild(newVolumeNumberField);
    $(newVolumeNumberField).on("hidden.bs.collapse", function(event)
                                                    {
                                                        newVolumeNumberToggleIcon.classList.replace("fa-angle-down", "fa-angle-right");
                                                    });
    $(newVolumeNumberField).on("shown.bs.collapse", function(event)
                                                    {
                                                        newVolumeNumberToggleIcon.classList.replace("fa-angle-right", "fa-angle-down");
                                                        this.style.height = "80px";
                                                    });

    //create new chapter number field
    const newChapterNumberContainer = document.createElement("div");
    newChapterNumberContainer.classList.add("form-group");
    massEditForm.appendChild(newChapterNumberContainer);
    const newChapterNumberToggle = document.createElement("a");
    newChapterNumberToggle.setAttribute("data-toggle", "collapse");
    newChapterNumberToggle.setAttribute("data-target", "#mass_new_chapter_number");
    newChapterNumberContainer.appendChild(newChapterNumberToggle);
    const newChapterNumberLabel = document.createElement("label");
    newChapterNumberLabel.setAttribute("for","mass_new_chapter_number");
    newChapterNumberLabel.classList.add("col-sm-3", "control-label");
    newChapterNumberLabel.innerText = "New chapter numbers";
    newChapterNumberToggle.appendChild(newChapterNumberLabel);
    const newChapterNumberToggleIcon = document.createElement("span");
    newChapterNumberToggleIcon.classList.add("fas", "fa-angle-down", "fa-fw");
    newChapterNumberLabel.appendChild(newChapterNumberToggleIcon);
    const newChapterNumberFieldContainer = document.createElement("div");
    newChapterNumberFieldContainer.classList.add("col-sm-9");
    newChapterNumberContainer.appendChild(newChapterNumberFieldContainer);
    const newChapterNumberField = document.createElement("textarea");
    newChapterNumberField.setAttribute("id", "mass_new_chapter_number");
    newChapterNumberField.setAttribute("name", "mass_new_chapter_number");
    newChapterNumberField.setAttribute("placeholder", "chapter1\nchapter2\nchapter3");
    newChapterNumberField.classList.add("form-control", "collapse", "in");
    newChapterNumberField.style.height = "80px";
    newChapterNumberFieldContainer.appendChild(newChapterNumberField);
    $(newChapterNumberField).on("hidden.bs.collapse", function(event)
                                                        {
                                                            newChapterNumberToggleIcon.classList.replace("fa-angle-down", "fa-angle-right");
                                                        });
    $(newChapterNumberField).on("shown.bs.collapse", function(event)
                                                    {
                                                        newChapterNumberToggleIcon.classList.replace("fa-angle-right", "fa-angle-down");
                                                        this.style.height = "80px";
                                                    });

    //create new language field
    const newLanguageContainer = document.createElement("div");
    newLanguageContainer.classList.add("form-group");
    massEditForm.appendChild(newLanguageContainer);
    const newLanguageToggle = document.createElement("a");
    newLanguageToggle.setAttribute("data-toggle", "collapse");
    newLanguageToggle.setAttribute("data-target", "#mass_new_language");
    newLanguageContainer.appendChild(newLanguageToggle);
    const newLanguageLabel = document.createElement("label");
    newLanguageLabel.setAttribute("for","mass_new_language");
    newLanguageLabel.classList.add("col-sm-3", "control-label");
    newLanguageLabel.innerText = "New languages";
    newLanguageToggle.appendChild(newLanguageLabel);
    const newLanguageToggleIcon = document.createElement("span");
    newLanguageToggleIcon.classList.add("fas", "fa-angle-right", "fa-fw");
    newLanguageLabel.appendChild(newLanguageToggleIcon);
    const newLanguageFieldContainer = document.createElement("div");
    newLanguageFieldContainer.classList.add("col-sm-9");
    newLanguageContainer.appendChild(newLanguageFieldContainer);
    const newLanguageField = document.createElement("textarea");
    newLanguageField.setAttribute("id", "mass_new_language");
    newLanguageField.setAttribute("name", "mass_new_language");
    newLanguageField.setAttribute("placeholder", "English\nSpanish (Es)\nPortuguese (Br)");
    newLanguageField.classList.add("form-control", "collapse");
    newLanguageField.style.height = "35px";
    newLanguageFieldContainer.appendChild(newLanguageField);
    $(newLanguageField).on("hidden.bs.collapse", function(event)
                                                {
                                                    newLanguageToggleIcon.classList.replace("fa-angle-down", "fa-angle-right");
                                                });
    $(newLanguageField).on("shown.bs.collapse", function(event)
                                                {
                                                    newLanguageToggleIcon.classList.replace("fa-angle-right", "fa-angle-down");
                                                    this.style.height = "80px";
                                                });

    //create new groupid field
    const newGroupIdContainer = document.createElement("div");
    newGroupIdContainer.classList.add("form-group");
    massEditForm.appendChild(newGroupIdContainer);
    const newGroupIdToggle = document.createElement("a");
    newGroupIdToggle.setAttribute("data-toggle", "collapse");
    newGroupIdToggle.setAttribute("data-target", "#mass_new_group_id");
    newGroupIdContainer.appendChild(newGroupIdToggle);
    const newGroupIdLabel = document.createElement("label");
    newGroupIdLabel.setAttribute("for","mass_new_group_id");
    newGroupIdLabel.classList.add("col-sm-3", "control-label");
    newGroupIdLabel.innerText = "New group IDs";
    newGroupIdToggle.appendChild(newGroupIdLabel);
    const newGroupIdToggleIcon = document.createElement("span");
    newGroupIdToggleIcon.classList.add("fas", "fa-angle-down", "fa-fw");
    newGroupIdLabel.appendChild(newGroupIdToggleIcon);
    const newGroupIdFieldContainer = document.createElement("div");
    newGroupIdFieldContainer.classList.add("col-sm-9");
    newGroupIdContainer.appendChild(newGroupIdFieldContainer);
    const newGroupIdField = document.createElement("textarea");
    newGroupIdField.setAttribute("id", "mass_new_group_id");
    newGroupIdField.setAttribute("name", "mass_new_group_id");
    newGroupIdField.setAttribute("placeholder", "chapter1\nchapter2\nchapter3");
    newGroupIdField.classList.add("form-control", "collapse", "in");
    newGroupIdField.style.height = "80px";
    newGroupIdFieldContainer.appendChild(newGroupIdField);
    $(newGroupIdField).on("hidden.bs.collapse", function(event)
                                                {
                                                    newGroupIdToggleIcon.classList.replace("fa-angle-down", "fa-angle-right");
                                                });
    $(newGroupIdField).on("shown.bs.collapse", function(event)
                                                {
                                                    newGroupIdToggleIcon.classList.replace("fa-angle-right", "fa-angle-down");
                                                    this.style.height = "80px";
                                                });

    //create new group2id field
    const newGroup2IdContainer = document.createElement("div");
    newGroup2IdContainer.classList.add("form-group");
    massEditForm.appendChild(newGroup2IdContainer);
    const newGroup2IdToggle = document.createElement("a");
    newGroup2IdToggle.setAttribute("data-toggle", "collapse");
    newGroup2IdToggle.setAttribute("data-target", "#mass_new_group_2_id");
    newGroup2IdContainer.appendChild(newGroup2IdToggle);
    const newGroup2IdLabel = document.createElement("label");
    newGroup2IdLabel.setAttribute("for","mass_new_group_2_id");
    newGroup2IdLabel.classList.add("col-sm-3", "control-label");
    newGroup2IdLabel.innerText = "New group 2 IDs";
    newGroup2IdToggle.appendChild(newGroup2IdLabel);
    const newGroup2IdToggleIcon = document.createElement("span");
    newGroup2IdToggleIcon.classList.add("fas", "fa-angle-right", "fa-fw");
    newGroup2IdLabel.appendChild(newGroup2IdToggleIcon);
    const newGroup2IdFieldContainer = document.createElement("div");
    newGroup2IdFieldContainer.classList.add("col-sm-9");
    newGroup2IdContainer.appendChild(newGroup2IdFieldContainer);
    const newGroup2IdField = document.createElement("textarea");
    newGroup2IdField.setAttribute("id", "mass_new_group_2_id");
    newGroup2IdField.setAttribute("name", "mass_new_group_2_id");
    newGroup2IdField.setAttribute("placeholder", "chapter1\nchapter2\nchapter3");
    newGroup2IdField.classList.add("form-control", "collapse");
    newGroup2IdField.style.height = "35px";
    newGroup2IdFieldContainer.appendChild(newGroup2IdField);
    $(newGroup2IdField).on("hidden.bs.collapse", function(event)
                                                {
                                                    newGroup2IdToggleIcon.classList.replace("fa-angle-down", "fa-angle-right");
                                                });
    $(newGroup2IdField).on("shown.bs.collapse", function(event)
                                                {
                                                    newGroup2IdToggleIcon.classList.replace("fa-angle-right", "fa-angle-down");
                                                    this.style.height = "80px";
                                                });

    //create new group3id field
    const newGroup3IdContainer = document.createElement("div");
    newGroup3IdContainer.classList.add("form-group");
    massEditForm.appendChild(newGroup3IdContainer);
    const newGroup3IdToggle = document.createElement("a");
    newGroup3IdToggle.setAttribute("data-toggle", "collapse");
    newGroup3IdToggle.setAttribute("data-target", "#mass_new_group_3_id");
    newGroup3IdContainer.appendChild(newGroup3IdToggle);
    const newGroup3IdLabel = document.createElement("label");
    newGroup3IdLabel.setAttribute("for","mass_new_group_3_id");
    newGroup3IdLabel.classList.add("col-sm-3", "control-label");
    newGroup3IdLabel.innerText = "New group 3 IDs";
    newGroup3IdToggle.appendChild(newGroup3IdLabel);
    const newGroup3IdToggleIcon = document.createElement("span");
    newGroup3IdToggleIcon.classList.add("fas", "fa-angle-right", "fa-fw");
    newGroup3IdLabel.appendChild(newGroup3IdToggleIcon);
    const newGroup3IdFieldContainer = document.createElement("div");
    newGroup3IdFieldContainer.classList.add("col-sm-9");
    newGroup3IdContainer.appendChild(newGroup3IdFieldContainer);
    const newGroup3IdField = document.createElement("textarea");
    newGroup3IdField.setAttribute("id", "mass_new_group_3_id");
    newGroup3IdField.setAttribute("name", "mass_new_group_3_id");
    newGroup3IdField.setAttribute("placeholder", "chapter1\nchapter2\nchapter3");
    newGroup3IdField.classList.add("form-control", "collapse");
    newGroup3IdField.style.height = "35px";
    newGroup3IdFieldContainer.appendChild(newGroup3IdField);
    $(newGroup3IdField).on("hidden.bs.collapse", function(event)
                                                {
                                                    newGroup3IdToggleIcon.classList.replace("fa-angle-down", "fa-angle-right");
                                                });
    $(newGroup3IdField).on("shown.bs.collapse", function(event)
                                                {
                                                    newGroup3IdToggleIcon.classList.replace("fa-angle-right", "fa-angle-down");
                                                    this.style.height = "80px";
                                                });

    //create file field
    const fileContainer = document.createElement("div");
    fileContainer.classList.add("form-group");
    massEditForm.appendChild(fileContainer);
    const fileToggle = document.createElement("a");
    fileToggle.setAttribute("data-toggle", "collapse");
    fileToggle.setAttribute("data-target", "#mass_file_container");
    fileContainer.appendChild(fileToggle);
    const fileLabel = document.createElement("label");
    fileLabel.classList.add("col-sm-3", "control-label");
    fileLabel.innerText = "New Files";
    fileToggle.appendChild(fileLabel);
    const fileToggleIcon = document.createElement("span");
    fileToggleIcon.classList.add("fas", "fa-angle-right", "fa-fw");
    fileLabel.appendChild(fileToggleIcon);
    const fileFieldContainer = document.createElement("div");
    fileFieldContainer.classList.add("col-sm-9", "collapse");
    fileFieldContainer.setAttribute("id", "mass_file_container");
    fileContainer.appendChild(fileFieldContainer);
    const fileInputGroup = document.createElement("div");
    fileInputGroup.classList.add("input-group");
    fileFieldContainer.appendChild(fileInputGroup);
    const fileText = document.createElement("input");
    fileText.classList.add("form-control");
    fileText.setAttribute("type", "text");
    fileText.setAttribute("placeholder", "No files selected");
    fileText.setAttribute("disabled", "true");
    fileInputGroup.appendChild(fileText);
    const fileButtonGroup = document.createElement("span");
    fileButtonGroup.classList.add("input-group-btn");
    fileInputGroup.appendChild(fileButtonGroup);
    const fileButton = document.createElement("span");
    fileButton.classList.add("btn", "btn-default", "btn-file");
    fileButtonGroup.appendChild(fileButton);
    const fileButtonIcon = document.createElement("span");
    fileButtonIcon.classList.add("far", "fa-folder-open", "fa-fw");
    fileButtonIcon.style.marginRight = "3px";
    fileButton.appendChild(fileButtonIcon);
    const fileButtonText = document.createElement("span");
    fileButtonText.classList.add("span-1280");
    fileButtonText.innerText = "Browse";
    fileButton.appendChild(fileButtonText);
    const fileField = document.createElement("input");
    fileField.setAttribute("id", "mass_file");
    fileField.setAttribute("type", "file");
    fileField.setAttribute("name", "file");
    fileField.setAttribute("multiple", "true");
    fileField.setAttribute("accept", ".zip,.cbz");
    fileButton.appendChild(fileField);
    var reversedFiles = [];
    fileField.addEventListener("change", function()
                                        {
                                            if(this.files.length == 1)
                                            {
                                                fileText.value = this.files.length + " file selected";
                                            }
                                            else
                                            {
                                                fileText.value = this.files.length + " files selected";
                                            }

                                            for(let i = 0; i < this.files.length; i++)
                                            {
                                                reversedFiles[i] = this.files[i];
                                            }
                                            reversedFiles.reverse();
                                        });
    $(fileFieldContainer).on("hidden.bs.collapse", function(event)
                                                {
                                                    fileToggleIcon.classList.replace("fa-angle-down", "fa-angle-right");
                                                });
    $(fileFieldContainer).on("shown.bs.collapse", function(event)
                                                {
                                                    fileToggleIcon.classList.replace("fa-angle-right", "fa-angle-down");
                                                });

    //create buttons
    const buttonsContainer = document.createElement("div");
    buttonsContainer.classList.add("form-group");
    massEditForm.appendChild(buttonsContainer);
    const buttonsDiv = document.createElement("div");
    buttonsDiv.classList.add("col-sm-12", "text-right", "btn-toolbar");
    buttonsContainer.appendChild(buttonsDiv);
    const editButton = document.createElement("button");
    editButton.setAttribute("id", "mass_edit_save_button");
    editButton.setAttribute("type", "button");
    editButton.classList.add("btn", "btn-success", "pull-right");
    buttonsDiv.appendChild(editButton);
    const editButtonIcon = document.createElement("span");
    editButtonIcon.classList.add("fas", "fa-save", "fa-fw");
    editButtonIcon.style.marginRight = "3px";
    editButton.appendChild(editButtonIcon);
    const editButtonText = document.createElement("span");
    editButtonText.classList.add("span-1280");
    editButtonText.innerText = "Apply Edit";
    editButton.appendChild(editButtonText);
    const cancelButton = document.createElement("button");
    cancelButton.setAttribute("id", "mass_edit_cancel_button");
    cancelButton.setAttribute("type", "button");
    cancelButton.classList.add("btn", "btn-danger", "pull-right");
    buttonsDiv.appendChild(cancelButton);
    const cancelButtonIcon = document.createElement("span");
    cancelButtonIcon.classList.add("fas", "fa-ban", "fa-fw");
    cancelButtonIcon.style.marginRight = "3px";
    cancelButton.appendChild(cancelButtonIcon);
    const cancelButtonText = document.createElement("span");
    cancelButtonText.classList.add("span-1280");
    cancelButtonText.innerText = "Cancel";
    cancelButton.appendChild(cancelButtonText);
    const previewButton = document.createElement("button");
    previewButton.setAttribute("id", "mass_edit_preview_button");
    previewButton.setAttribute("type", "button");
    previewButton.classList.add("btn", "btn-info", "pull-right");
    buttonsDiv.appendChild(previewButton);
    const previewButtonIcon = document.createElement("span");
    previewButtonIcon.classList.add("fas", "fa-eye", "fa-fw");
    previewButtonIcon.style.marginRight = "3px";
    previewButton.appendChild(previewButtonIcon);
    const previewButtonText = document.createElement("span");
    previewButtonText.classList.add("span-1280");
    previewButtonText.innerText = "Preview Edit";
    previewButton.appendChild(previewButtonText);
    editButton.addEventListener("click", function(event)
                                        {
                                            massEdit([chapterTitleToEditField.value, volumeNumberToEditField.value, chapterNumberToEditField.value, languageToEditField.value, groupIdToEditField.value, group2IdToEditField.value, group3IdToEditField.value, newChapterTitleField.value, newVolumeNumberField.value, newChapterNumberField.value, newLanguageField.value, newGroupIdField.value, newGroup2IdField.value, newGroup3IdField.value, reversedFiles]);
                                        });
    cancelButton.addEventListener("click", function()
                                            {
                                                massEditForm.reset();
                                                massEditForm.style.display = "none";
                                                mangaInfo.style.display =  "block";
                                            });
    previewButton.addEventListener("click", function(event)
                                            {
                                                previewEdit([chapterTitleToEditField.value, volumeNumberToEditField.value, chapterNumberToEditField.value, languageToEditField.value, groupIdToEditField.value, group2IdToEditField.value, group3IdToEditField.value, newChapterTitleField.value, newVolumeNumberField.value, newChapterNumberField.value, newLanguageField.value, newGroupIdField.value, newGroup2IdField.value, newGroup3IdField.value, reversedFiles]);
                                            });

    //add preview table
    const editPreviewTable = document.createElement("table");
    editPreviewTable.classList.add("table", "table-hover", "table-striped", "table-condensed");
    massEditForm.appendChild(editPreviewTable);
    const editPreviewTableBody = document.createElement("tbody");
    editPreviewTableBody.id = "edit_preview";
    editPreviewTable.appendChild(editPreviewTableBody);

    //add mass edit button to open form
    const actionsContainer = document.getElementById("upload_button").parentNode;
    actionsContainer.classList.add("btn-toolbar");
    const openEditButton = document.createElement("button");
    openEditButton.setAttribute("id", "mass_edit_open_button");
    openEditButton.setAttribute("type", "button");
    openEditButton.classList.add("btn", "btn-success", "pull-right");
    actionsContainer.appendChild(openEditButton);
    const openEditButtonIcon = document.createElement("span");
    openEditButtonIcon.classList.add("fas", "fa-edit", "fa-fw");
    openEditButtonIcon.style.marginRight = "3px";
    openEditButton.appendChild(openEditButtonIcon);
    const openEditButtonText = document.createElement("span");
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
    $('a[href*="/chapter/"]').not($('a[href*="/comments"]')).each(function (chapter)
                                    {
                                        //title, volNum, and chapNum are given fake initial values so that empty values are grabbable by "Read Online"/" "
                                        var title = "Read Online";
                                        if($(this).get(0).getAttribute('data-chapter-name') !== "")
                                        {
                                            title = $(this).get(0).getAttribute('data-chapter-name');
                                        }
                                        var volNum = " ";
                                        if($(this).get(0).getAttribute('data-volume-num') !== "")
                                        {
                                            volNum = $(this).get(0).getAttribute('data-volume-num');
                                        }
                                        var chapNum = " ";
                                        if($(this).get(0).getAttribute('data-chapter-num') !== "")
                                        {
                                            chapNum = $(this).get(0).getAttribute('data-chapter-num');
                                        }
                                        const langTitle = $(this).closest('tr').find('img[src*="/images/flags/"]')[0].title;
                                        const groupId = $(this).closest('tr').find('a[href*="/group/"]')[0].href.match(/(\d+)/)[0];
                                        var group2Id = "0";
                                        if($(this).closest('tr').find('a[href*="/group/"]').length > 1)
                                        {
                                            group2Id = $(this).closest('tr').find('a[href*="/group/"]')[1].href.match(/(\d+)/)[0];
                                        }
                                        var group3Id = "0";
                                        if($(this).closest('tr').find('a[href*="/group/"]').length > 2)
                                        {
                                            group3Id = $(this).closest('tr').find('a[href*="/group/"]')[2].href.match(/(\d+)/)[0];
                                        }

                                        if((oldChapterTitles.includes(title) || (oldChapterTitles.length == 1 && oldChapterTitles[0] === "")) && (oldChapterNumbers.includes(chapNum) || (oldChapterNumbers.length == 1 && oldChapterNumbers[0] === "")) && (oldVolumeNumbers.includes(volNum) || (oldVolumeNumbers.length == 1 && oldVolumeNumbers[0] === "")) && (oldLanguages.includes(langTitle) || (oldLanguages.length == 1 && oldLanguages[0] === "")) && (oldGroups.includes(groupId) || (oldGroups.length == 1 && oldGroups[0] === "")) && (oldGroups2.includes(group2Id) || (oldGroups2.length == 1 && oldGroups2[0] === "")) && (oldGroups3.includes(group3Id) || (oldGroups3.length == 1 && oldGroups3[0] === ""))) //only push chapters in list
                                        {
                                            const editPreviewOld = this.parentNode.parentNode.cloneNode(true);
                                            editPreviewOld.childNodes[1].innerHTML = "<span class='fas fa-strikethrough' aria-hidden='true' title=''></span>";
                                            previewTable.appendChild(editPreviewOld);
                                            const editPreviewNew = this.parentNode.parentNode.cloneNode(true);
                                            editPreviewNew.childNodes[1].innerHTML = "<span class='fas fa-pencil-alt' aria-hidden='true' title=''></span>";
                                            var chapterTitlePreview;
                                            if(newChapterTitles.length == 1)
                                            {
                                                if(newChapterTitles[0] === "")
                                                {
                                                    chapterTitlePreview = title;
                                                }
                                                else if(newChapterTitles[0] === " ")
                                                {
                                                    chapterTitlePreview = "Read Online";
                                                }
                                                else
                                                {
                                                    chapterTitlePreview = newChapterTitles[0];
                                                }
                                            }
                                            else
                                            {
                                                if(newChapterTitles[i] === " ")
                                                {
                                                    chapterTitlePreview = "Read Online";
                                                }
                                                else
                                                {
                                                    chapterTitlePreview = newChapterTitles[i] || title;
                                                }
                                            }
                                            var volumeNumberPreview;
                                            if(newVolumeNumbers.length == 1)
                                            {
                                                if(newVolumeNumbers[0] === "")
                                                {
                                                    volumeNumberPreview = volNum;
                                                }
                                                else
                                                {
                                                    volumeNumberPreview = newVolumeNumbers[0];
                                                }
                                            }
                                            else
                                            {
                                                volumeNumberPreview = newVolumeNumbers[i] || volNum;
                                            }
                                            var chapterNumberPreview;
                                            if(newChapterNumbers.length == 1)
                                            {
                                                if(newChapterNumbers[0] === "")
                                                {
                                                    chapterNumberPreview = chapNum;
                                                }
                                                else
                                                {
                                                    chapterNumberPreview = newChapterNumbers[0];
                                                }
                                            }
                                            else
                                            {
                                                chapterNumberPreview = newChapterNumbers[i] || chapNum;
                                            }
                                            var languagePreview;
                                            if(newLanguages.length == 1)
                                            {
                                                if(newLanguages[0] === "")
                                                {
                                                    languagePreview = langTitle;
                                                }
                                                else
                                                {
                                                    languagePreview = newLanguages[0];
                                                }
                                            }
                                            else
                                            {
                                                languagePreview = newLanguages[i] || langTitle;
                                            }
                                            var groupPreview;
                                            if(newGroups.length == 1)
                                            {
                                                if(newGroups[0] === "")
                                                {
                                                    groupPreview = groupId;
                                                }
                                                else
                                                {
                                                    groupPreview = newGroups[0];
                                                }
                                            }
                                            else
                                            {
                                                groupPreview = newGroups[i] || groupId;
                                            }
                                            var group2Preview;
                                            if(newGroups2.length == 1)
                                            {
                                                if(newGroups2[0] === "")
                                                {
                                                    group2Preview = group2Id;
                                                }
                                                else
                                                {
                                                    group2Preview = newGroups2[0];
                                                }
                                            }
                                            else
                                            {
                                                group2Preview = newGroups2[i] || group2Id;
                                            }
                                            var group3Preview;
                                            if(newGroups3.length == 1)
                                            {
                                                if(newGroups3[0] === "")
                                                {
                                                    group3Preview = group3Id;
                                                }
                                                else
                                                {
                                                    group3Preview = newGroups3[0];
                                                }
                                            }
                                            else
                                            {
                                                group3Preview = newGroups3[i] || group3Id;
                                            }

                                            //fill in new preview
                                            editPreviewNew.childNodes[3].innerText = "";
                                            if(volumeNumberPreview !== " ")
                                            {
                                                editPreviewNew.childNodes[3].innerText += "Vol. " +  volumeNumberPreview;
                                            }
                                            if(chapterNumberPreview !== " ")
                                            {
                                                editPreviewNew.childNodes[3].innerText += " Ch. " + chapterNumberPreview;
                                            }
                                            if(editPreviewNew.childNodes[3].innerText != "")
                                            {
                                                editPreviewNew.childNodes[3].innerText +=  " - ";
                                            }
                                            editPreviewNew.childNodes[3].innerText += chapterTitlePreview;
                                            editPreviewNew.childNodes[7].childNodes[0].setAttribute("src", "https://s1.mangadex.org/images/flags/" + flags[languagePreview] + ".png");
                                            editPreviewNew.childNodes[7].childNodes[0].setAttribute("alt", languagePreview);
                                            editPreviewNew.childNodes[7].childNodes[0].setAttribute("title", languagePreview);
                                            editPreviewNew.childNodes[9].innerHTML = "<a href='/group/" + groupPreview + "'>" + groupPreview + "</a>";
                                            if(group2Preview != "0")
                                            {
                                                editPreviewNew.childNodes[9].innerHTML += " | <a href='/group/" + group2Preview + "'>" + group2Preview + "</a>";
                                            }
                                            if(group3Preview != "0")
                                            {
                                                editPreviewNew.childNodes[9].innerHTML += " | <a href='/group/" + group3Preview + "'>" + group3Preview + "</a>";
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

    const messageContainer = document.getElementById("message_container");

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
    var oldData = [];
    var newData = [];

    // good place to put some data:
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
    const newFiles = fields[14];

    const previewTable = document.getElementById("edit_preview");

    while (previewTable.firstChild) //delete current preview because function below will get it and submit everything twice so probably fix this properly later
    {
        previewTable.removeChild(previewTable.firstChild);
    }

    $('a[href*="/chapter/"]').not($('a[href*="/comments"]')).each(function (chapter)
                                    {
                                        //title, volNum, and chapNum are given fake initial values so that empty values are grabbable by "Read Online"/" "
                                        const title = $(this).get(0).getAttribute('data-chapter-name');
                                        var tempTitle = "Read Online"; //use a tempTitle because the site treats "Read Online" differently from ""
                                        if (title !== "")
                                        {
                                            tempTitle = title;
                                        }
                                        var volNum = " "; //don't need to use temp for these since they'll get trimmed anyway
                                        if($(this).get(0).getAttribute('data-volume-num') !== "")
                                        {
                                            volNum = $(this).get(0).getAttribute('data-volume-num');
                                        }
                                        var chapNum = " ";
                                        if($(this).get(0).getAttribute('data-chapter-num') !== "")
                                        {
                                            chapNum = $(this).get(0).getAttribute('data-chapter-num');
                                        }
                                        const langTitle = $(this).closest('tr').find('img[src*="/images/flags/"]')[0].title;
                                        const groupId = $(this).closest('tr').find('a[href*="/group/"]')[0].href.match(/(\d+)/)[0];
                                        var group2Id = "0";
                                        if($(this).closest('tr').find('a[href*="/group/"]').length > 1)
                                        {
                                            group2Id = $(this).closest('tr').find('a[href*="/group/"]')[1].href.match(/(\d+)/)[0];
                                        }
                                        var group3Id = "0";
                                        if($(this).closest('tr').find('a[href*="/group/"]').length > 2)
                                        {
                                            group3Id = $(this).closest('tr').find('a[href*="/group/"]')[2].href.match(/(\d+)/)[0];
                                        }

                                        if((oldChapterTitles.includes(tempTitle) || (oldChapterTitles.length == 1 && oldChapterTitles[0] === "")) && (oldChapterNumbers.includes(chapNum) || (oldChapterNumbers.length == 1 && oldChapterNumbers[0] === "")) && (oldVolumeNumbers.includes(volNum) || (oldVolumeNumbers.length == 1 && oldVolumeNumbers[0] === "")) && (oldLanguages.includes(langTitle) || (oldLanguages.length == 1 && oldLanguages[0] === "")) && (oldGroups.includes(groupId) || (oldGroups.length == 1 && oldGroups[0] === "")) && (oldGroups2.includes(group2Id) || (oldGroups2.length == 1 && oldGroups2[0] === "")) && (oldGroups3.includes(group3Id) || (oldGroups3.length == 1 && oldGroups3[0] === ""))) //only push chapters in list
                                        {
                                            const chapId = $(this).get(0).href.match(/(\d+)/)[0];
                                            toEdit.push([chapId, volNum, chapNum, title, groupId, group2Id, group3Id, langTitle, newFiles]);
                                        }
                                    });
    for (let i = 0, len = toEdit.length; i < len; i++)
    {
        messageContainer.innerHTML = "<div class='alert alert-success text-center' style='pointer-events: auto;' role='alert'><a href='#' class='pull-right fas fa-window-close' data-dismiss='alert'></a>Processing " + (i + 1) + "/" + len + "</div>."
        // data format 0:chapId 1:volNum 2:chapNum 3:title 4:groupId 5:group2Id 6:group3Id 7:langTitle 8:file(optional)
        var oldData = toEdit[i];
        var newData = oldData.slice(0);

        // oldData holds the current information for the chapter. Don't change it
        // make your changes to newData, which is a clone of oldData by default
        // --- CHANGES TO DATA HERE ---
        //if there are no new values use old
        if(newVolumeNumbers.length == 1)
        {
            if(newVolumeNumbers[0] === "")
            {
                newData[1] = oldData[1];
            }
            else
            {
                newData[1] = newVolumeNumbers[0];
            }
        }
        else
        {
            newData[1] = newVolumeNumbers[i] || oldData[1];
        }
        if(newChapterNumbers.length == 1)
        {
            if(newChapterNumbers[0] === "")
            {
                newData[2] = oldData[2];
            }
            else
            {
                newData[2] = newChapterNumbers[0];
            }
        }
        else
        {
            newData[2] = newChapterNumbers[i] || oldData[2];
        }
        if(newChapterTitles.length == 1)
        {
            if(newChapterTitles[0] === "")
            {
                newData[3] = oldData[3];
            }
            else
            {
                newData[3] = newChapterTitles[0];
            }
        }
        else
        {
            newData[3] = newChapterTitles[i] || oldData[3];
        }
        if(newGroups.length == 1)
        {
            if(newGroups[0] === "")
            {
                newData[4] = oldData[4];
            }
            else
            {
                newData[4] = newGroups[0];
            }
        }
        else
        {
            newData[4] = newGroups[i] || oldData[4];
        }
        if(newGroups2.length == 1)
        {
            if(newGroups2[0] === "")
            {
                newData[5] = oldData[5];
            }
            else
            {
                newData[5] = newGroups2[0];
            }
        }
        else
        {
            newData[5] = newGroups2[i] || oldData[5];
        }
        if(newGroups3.length == 1)
        {
            if(newGroups3[0] === "")
            {
                newData[6] = oldData[6];
            }
            else
            {
                newData[6] = newGroups3[0];
            }
        }
        else
        {
            newData[6] = newGroups3[i] || oldData[6];
        }
        if(newLanguages.length == 1)
        {
            if(newLanguages[0] === "")
            {
                newData[7] = oldData[7];
            }
            else
            {
                newData[7] = newLanguages[0];
            }
        }
        else
        {
            newData[7] = newLanguages[i] || oldData[7];
        }

        // check for either volume or chapter present
        if ((x => y => x || y)(newData[2], newData[1]));
        {
            // check wether the data is actually different
            if (arraysEqual(oldData, newData) && newData[8].length == 0)
            {
                messageContainer.innerHTML = "<div class='alert alert-success text-center' style='pointer-events: auto;' role='alert'><a href='#' class='pull-right fas fa-window-close' data-dismiss='alert'></a>No changes in " + (i + 1) + "/" + len + ", skipping</div>.";
            }
            else
            {
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
                if(newData[8][i] == undefined)
                {
                    formData.append("old_file", "");
                }
                else
                {
                    formData.append("old_file", "why is this a thing holo");
                }
                formData.append('file', newData[8][i]);

                const headers = new Headers();
                headers.append("x-requested-with", "XMLHttpRequest");

                // send 'em away
                try
                {
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
                }
                catch(e)
                {
                    console.error('Error:', e);
                    messageContainer.innerHTML = "<div class='alert alert-danger text-center' style='pointer-events: auto;' role='alert'><a href='#' class='pull-right fas fa-window-close' data-dismiss='alert'></a>Not ok.</div>.";
                }
            }
        }
    }
    messageContainer.innerHTML = "<div class='alert alert-success text-center' style='pointer-events: auto;' role='alert'><a href='#' class='pull-right fas fa-window-close' data-dismiss='alert'></a>all cool and good 👌👌👌👌👌</div>.";
}