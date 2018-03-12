// ==UserScript==
// @name         Mangadex Mass Uploader
// @namespace    https://github.com/LucasPratas/userscripts
// @version      1.88
// @icon         https://mangadex.org/favicon.ico
// @description  try to get green!
// @author       Xnot
// @updateURL    https://github.com/LucasPratas/userscripts/raw/master/mangadex-massuploader.user.js
// @downloadURL  https://github.com/LucasPratas/userscripts/raw/master/mangadex-massuploader.user.js
// @match        https://mangadex.org/upload/*
// @grant        none
// ==/UserScript==

function createForm() //creates mass upload form
{
    var userscriptInfo = document.createElement("div"); //info panel with userscript instructions
    userscriptInfo.classList.add("alert", "alert-info");
    userscriptInfo.setAttribute("role", "alert");
    userscriptInfo.innerHTML = "<h4>You are using Mangadex Mass Uploader by Xnot</h4>" +
        "<ol><li>Insert chapter names,volume numbers, chapter numbers, and group IDs into their respective fields. Each line is one chapter" +
        "<br />Alternatively, inputting a single name/volume/groupID/non-numerical ch.number will use that for all uploads, and inputing a single numerical chapter will increment it for each upload" +
        "<br />Obviously only use those options if there is only one volume/group/if there are no special chapters in your files" +
        "<br />If you want a chapter to have an empty title or whatever leave an empty line in the respective field. Except for Group 1, every chapter MUST have a Group 1" +
        "<br />Selecting a group in the dropdown in the bottom form will give you the group IDs" +
        "<li>Check the group delay box if you feel so inclined (will apply for all uploads)" +
        "<li>Click browse and use shift/ctrl so select all files" +
        "<br />If you hover over the browse button you can check if the files are in the expected order" +
        "<li>Select language from the standard upload form below the mass upload form" +
        "<li>Click the Mass Upload button" +
        "<li>If you realized you've fucked up halfway through, just close the tab or something, cause I have no idea how to make a cancel button and Holo didn't make one for me to rip off</ol>" +
    "If there are any problems @ or pm me on Discord<br />" +
    "Update 1.85:" +
        "<ul><li>Remade the entire form creation code to create form from scratch instead of ripping off Holo's form. Hopefully this fixes shit for certain people for who the last update was broken. Also now it won't break when Holo changes the form. Probably." + 
        "<li>The progress bar is now at the bottom</ul>" +
    "Update 1.88:" +
        "<ul><li>Uploading now gets canceled on some errors that return a success code (locked groups, invalid files, etc)" +
        "<li>Error messages from such errors now have a close button" +
        "<li>Removed (shitty) from the name since it's pretty decent now :^)" +
        "<li>The file field now only accepts .zip and .cbz</ul>";
    var container = document.getElementById("content");
    container.insertBefore(userscriptInfo, container.getElementsByClassName("panel panel-default")[1]); //insert info panel

    document.getElementById("message_container").classList.replace("display-none", "display-block");

    //create form
    var massUploadForm = document.createElement("form");
    massUploadForm.setAttribute("id", "mass_upload_form");
    massUploadForm.classList.add("form-horizontal");
    massUploadForm.style.marginTop = "15px";
    container.getElementsByClassName("panel-body")[1].insertBefore(massUploadForm, document.getElementById("upload_form")); //insert mass upload form

    //create mango field
    var mangaContainer = document.createElement("div");
    mangaContainer.classList.add("form-group");
    massUploadForm.appendChild(mangaContainer);
    var mangaLabel = document.createElement("label");
    mangaLabel.setAttribute("for","mass_manga_id");
    mangaLabel.classList.add("col-sm-3", "control-label");
    mangaLabel.innerText = "Manga name";
    mangaContainer.appendChild(mangaLabel);
    var mangaFieldContainer = document.createElement("div");
    mangaFieldContainer.classList.add("col-sm-9");
    mangaContainer.appendChild(mangaFieldContainer);
    var mangaField = document.createElement("input");
    mangaField.setAttribute("id", "mass_manga_id");
    mangaField.setAttribute("type", "text");
    mangaField.setAttribute("title", "To change the manga, go to the manga page.");
    mangaField.setAttribute("placeholder", document.getElementById("manga_id").value);
    mangaField.setAttribute("disabled", "true");
    mangaField.classList.add("form-control");
    mangaFieldContainer.appendChild(mangaField);

    //create chapter name field
    var chapterNameContainer = document.createElement("div");
    chapterNameContainer.classList.add("form-group");
    massUploadForm.appendChild(chapterNameContainer);
    var chapterNameLabel = document.createElement("label");
    chapterNameLabel.setAttribute("for","mass_chapter_name");
    chapterNameLabel.classList.add("col-sm-3", "control-label");
    chapterNameLabel.innerText = "Chapter names";
    chapterNameContainer.appendChild(chapterNameLabel);
    var chapterNameFieldContainer = document.createElement("div");
    chapterNameFieldContainer.classList.add("col-sm-9");
    chapterNameContainer.appendChild(chapterNameFieldContainer);
    var chapterNameField = document.createElement("textarea");
    chapterNameField.setAttribute("id", "mass_chapter_name");
    chapterNameField.setAttribute("name", "mass_chapter_name");
    chapterNameField.setAttribute("placeholder", "nameForCh1\nnameForCh2\nnameForCh3");
    chapterNameField.classList.add("form-control");
    chapterNameFieldContainer.appendChild(chapterNameField);

    //create volume number field
    var volumeNumberContainer = document.createElement("div");
    volumeNumberContainer.classList.add("form-group");
    massUploadForm.appendChild(volumeNumberContainer);
    var volumeNumberLabel = document.createElement("label");
    volumeNumberLabel.setAttribute("for","mass_chapter_name");
    volumeNumberLabel.classList.add("col-sm-3", "control-label");
    volumeNumberLabel.innerText = "Volume numbers";
    volumeNumberContainer.appendChild(volumeNumberLabel);
    var volumeNumberFieldContainer = document.createElement("div");
    volumeNumberFieldContainer.classList.add("col-sm-9");
    volumeNumberContainer.appendChild(volumeNumberFieldContainer);
    var volumeNumberField = document.createElement("textarea");
    volumeNumberField.setAttribute("id", "mass_volume_number");
    volumeNumberField.setAttribute("name", "mass_volume_number");
    volumeNumberField.setAttribute("placeholder", "volumeForCh1\nvolumeForCh2\nvolumeForCh3");
    volumeNumberField.classList.add("form-control");
    volumeNumberFieldContainer.appendChild(volumeNumberField);

    //create chapter number field
    var chapterNumberContainer = document.createElement("div");
    chapterNumberContainer.classList.add("form-group");
    massUploadForm.appendChild(chapterNumberContainer);
    var chapterNumberLabel = document.createElement("label");
    chapterNumberLabel.setAttribute("for","mass_chapter_number");
    chapterNumberLabel.classList.add("col-sm-3", "control-label");
    chapterNumberLabel.innerText = "Chapter numbers";
    chapterNumberContainer.appendChild(chapterNumberLabel);
    var chapterNumberFieldContainer = document.createElement("div");
    chapterNumberFieldContainer.classList.add("col-sm-9");
    chapterNumberContainer.appendChild(chapterNumberFieldContainer);
    var chapterNumberField = document.createElement("textarea");
    chapterNumberField.setAttribute("id", "mass_chapter_number");
    chapterNumberField.setAttribute("name", "mass_chapter_number");
    chapterNumberField.setAttribute("placeholder", "1\n2\n3");
    chapterNumberField.classList.add("form-control");
    chapterNumberFieldContainer.appendChild(chapterNumberField);

    //create delay field
    var groupDelayContainer = document.createElement("div");
    groupDelayContainer.classList.add("form-group");
    massUploadForm.appendChild(groupDelayContainer);
    var groupDelayLabel = document.createElement("label");
    groupDelayLabel.setAttribute("for","mass_group_delay");
    groupDelayLabel.classList.add("col-sm-3", "control-label");
    groupDelayLabel.innerText = "Apply group delays";
    groupDelayContainer.appendChild(groupDelayLabel);
    var groupDelayCheckboxContainer = document.createElement("div");
    groupDelayCheckboxContainer.classList.add("col-sm-9");
    groupDelayContainer.appendChild(groupDelayCheckboxContainer);
    var groupDelayCheckboxDiv = document.createElement("div");
    groupDelayCheckboxDiv.classList.add("checkbox");
    groupDelayCheckboxContainer.appendChild(groupDelayCheckboxDiv);
    var groupDelayCheckbox = document.createElement("label");
    groupDelayCheckboxDiv.appendChild(groupDelayCheckbox);
    var groupDelayCheckboxField = document.createElement("input");
    groupDelayCheckboxField.setAttribute("id", "mass_group_delay");
    groupDelayCheckboxField.setAttribute("name", "mass_group_delay");
    groupDelayCheckboxField.setAttribute("type", "checkbox");
    groupDelayCheckbox.appendChild(groupDelayCheckboxField);
    var groupDelayCheckboxText = document.createTextNode("Will apply to all uploads.");
    groupDelayCheckbox.appendChild(groupDelayCheckboxText);
    groupDelayCheckboxField.addEventListener("click", function()
                                                        {
                                                            document.getElementById("group_delay").checked = this.checked;
                                                        });

    //create group1 field
    var group1Container = document.createElement("div");
    group1Container.classList.add("form-group");
    massUploadForm.appendChild(group1Container);
    var group1Label = document.createElement("label");
    group1Label.setAttribute("for","mass_group_id");
    group1Label.classList.add("col-sm-3", "control-label");
    group1Label.innerText = "Groups 1";
    group1Container.appendChild(group1Label);
    var group1FieldContainer = document.createElement("div");
    group1FieldContainer.classList.add("col-sm-9");
    group1Container.appendChild(group1FieldContainer);
    var group1Field = document.createElement("textarea");
    group1Field.setAttribute("id", "mass_group_id");
    group1Field.setAttribute("name", "mass_group_id");
    group1Field.setAttribute("placeholder", "Use dropdown in the bottom form or insert group IDs (NOT NAME) here");
    group1Field.classList.add("form-control");
    group1FieldContainer.appendChild(group1Field);
    document.getElementById("group_id").addEventListener("change", function()
                                                                    {
                                                                        group1Field.value = this.options[this.selectedIndex].value;
                                                                        this.previousSibling.previousSibling.childNodes[0].childNodes[1].data += " - ID: " + this.options[this.selectedIndex].value;
                                                                    });

    //create group2 field
    var group2Container = document.createElement("div");
    group2Container.classList.add("form-group");
    massUploadForm.appendChild(group2Container);
    var group2Label = document.createElement("label");
    group2Label.setAttribute("for","mass_group_id_2");
    group2Label.classList.add("col-sm-3", "control-label");
    group2Label.innerText = "Groups 2";
    group2Container.appendChild(group2Label);
    var group2FieldContainer = document.createElement("div");
    group2FieldContainer.classList.add("col-sm-9");
    group2Container.appendChild(group2FieldContainer);
    var group2Field = document.createElement("textarea");
    group2Field.setAttribute("id", "mass_group_id_2");
    group2Field.setAttribute("name", "mass_group_id_2");
    group2Field.setAttribute("placeholder", "Use dropdown in the bottom form or insert group IDs (NOT NAME) here");
    group2Field.classList.add("form-control");
    group2FieldContainer.appendChild(group2Field);
    document.getElementById("group_id_2").addEventListener("change", function()
                                                                    {
                                                                        group2Field.value = this.options[this.selectedIndex].value;
                                                                        this.previousSibling.previousSibling.childNodes[0].childNodes[1].data += " - ID: " + this.options[this.selectedIndex].value;
                                                                    });

    //create group3 field
    var group3Container = document.createElement("div");
    group3Container.classList.add("form-group");
    massUploadForm.appendChild(group3Container);
    var group3Label = document.createElement("label");
    group3Label.setAttribute("for","mass_group_id_3");
    group3Label.classList.add("col-sm-3", "control-label");
    group3Label.innerText = "Groups 3";
    group3Container.appendChild(group3Label);
    var group3FieldContainer = document.createElement("div");
    group3FieldContainer.classList.add("col-sm-9");
    group3Container.appendChild(group3FieldContainer);
    var group3Field = document.createElement("textarea");
    group3Field.setAttribute("id", "mass_group_id_3");
    group3Field.setAttribute("name", "mass_group_id_3");
    group3Field.setAttribute("placeholder", "Use dropdown in the bottom form or insert group IDs (NOT NAME) here");
    group3Field.classList.add("form-control");
    group3FieldContainer.appendChild(group3Field);
    document.getElementById("group_id_3").addEventListener("change", function()
                                                                    {
                                                                        group3Field.value = this.options[this.selectedIndex].value;
                                                                        this.previousSibling.previousSibling.childNodes[0].childNodes[1].data += " - ID: " + this.options[this.selectedIndex].value;
                                                                    });

    //create language field
    var languageContainer = document.createElement("div");
    languageContainer.classList.add("form-group");
    massUploadForm.appendChild(languageContainer);
    var languageLabel = document.createElement("label");
    languageLabel.setAttribute("for","mass_lang_id");
    languageLabel.classList.add("col-sm-3", "control-label");
    languageLabel.innerText = "Languages";
    languageContainer.appendChild(languageLabel);
    var languageFieldContainer = document.createElement("div");
    languageFieldContainer.classList.add("col-sm-9");
    languageContainer.appendChild(languageFieldContainer);
    var languageField = document.createElement("textarea");
    languageField.setAttribute("id", "mass_lang_id");
    languageField.setAttribute("name", "mass_lang_id");
    languageField.setAttribute("placeholder", "Not implemented because no one mass uploads multiple languages, use language dropdown in the bottom form instead");
    languageField.setAttribute("disabled", "true");
    languageField.classList.add("form-control");
    languageFieldContainer.appendChild(languageField);

    //create file field
    var fileContainer = document.createElement("div");
    fileContainer.classList.add("form-group");
    massUploadForm.appendChild(fileContainer);
    var fileLabel = document.createElement("label");
    fileLabel.setAttribute("for","files");
    fileLabel.classList.add("col-sm-3", "control-label");
    fileLabel.innerText = "Files";
    fileContainer.appendChild(fileLabel);
    var fileFieldContainer = document.createElement("div");
    fileFieldContainer.classList.add("col-sm-9");
    fileContainer.appendChild(fileFieldContainer);
    var fileInputGroup = document.createElement("div");
    fileInputGroup.classList.add("input-group");
    fileFieldContainer.appendChild(fileInputGroup);
    var fileText = document.createElement("input");
    fileText.classList.add("form-control");
    fileText.setAttribute("type", "text");
    fileText.setAttribute("placeholder", "No files selected");
    fileText.setAttribute("disabled", "true");
    fileInputGroup.appendChild(fileText);
    var fileButtonGroup = document.createElement("span");
    fileButtonGroup.classList.add("input-group-btn");
    fileInputGroup.appendChild(fileButtonGroup);
    var fileButton = document.createElement("span");
    fileButton.classList.add("btn", "btn-default", "btn-file");
    fileButtonGroup.appendChild(fileButton);
    var fileButtonIcon = document.createElement("span");
    fileButtonIcon.classList.add("far", "fa-folder-open", "fa-fw");
    fileButtonIcon.style.marginRight = "3px";
    fileButton.appendChild(fileButtonIcon);
    var fileButtonText = document.createElement("span");
    fileButtonText.classList.add("span-1280");
    fileButtonText.innerText = "Browse";
    fileButton.appendChild(fileButtonText);
    var fileField = document.createElement("input");
    fileField.setAttribute("id", "mass_file");
    fileField.setAttribute("type", "file");
    fileField.setAttribute("name", "file");
    fileField.setAttribute("multiple", "true");
    fileField.setAttribute("accept", ".zip,.cbz");
    fileButton.appendChild(fileField);
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
                                            uploadButton.focus();
                                        });

    //create buttons
    var buttonsContainer = document.createElement("div");
    buttonsContainer.classList.add("form-group");
    massUploadForm.appendChild(buttonsContainer);
    var buttonsDiv = document.createElement("div");
    buttonsDiv.classList.add("col-sm-12", "text-right", "btn-toolbar");
    buttonsContainer.appendChild(buttonsDiv);
    var uploadButton = document.createElement("button");
    uploadButton.setAttribute("id", "mass_upload_button");
    uploadButton.setAttribute("type", "button");
    uploadButton.classList.add("btn", "btn-success", "pull-right");
    buttonsDiv.appendChild(uploadButton);
    var uploadButtonIcon = document.createElement("span");
    uploadButtonIcon.classList.add("fas", "fa-upload", "fa-fw");
    uploadButtonIcon.style.marginRight = "3px";
    uploadButton.appendChild(uploadButtonIcon);
    var uploadButtonText = document.createElement("span");
    uploadButtonText.classList.add("span-1280");
    uploadButtonText.innerText = "Mass Upload";
    uploadButton.appendChild(uploadButtonText);
        var resetButton = document.createElement("button");
    resetButton.setAttribute("id", "mass_reset_button");
    resetButton.setAttribute("type", "reset");
    resetButton.classList.add("btn", "btn-warning", "pull-right");
    buttonsDiv.appendChild(resetButton);
    var resetButtonIcon = document.createElement("span");
    resetButtonIcon.classList.add("fas", "fa-trash-alt", "fa-fw");
    resetButtonIcon.style.marginRight = "3px";
    resetButton.appendChild(resetButtonIcon);
    var resetButtonText = document.createElement("span");
    resetButtonText.classList.add("span-1280");
    resetButtonText.innerText = "Reset Form";
    resetButton.appendChild(resetButtonText);
    uploadButton.addEventListener("click", function(event)
                                            {
                                                massUpload(event, [chapterNameField, volumeNumberField, chapterNumberField, group1Field, group2Field, group3Field, fileField]);
                                            });
}

function massUpload(event, fields)
{
    var splitFields = splitInputs(fields);
    //this if statement is getting really long
    if((splitFields[6].length == splitFields[0].length || splitFields[0].length == 1) && (splitFields[6].length == splitFields[1].length || splitFields[1].length == 1) && (splitFields[6].length == splitFields[2].length || splitFields[2].length == 1) && (splitFields[6].length == splitFields[3].length || splitFields[3].length == 1) && !splitFields[3].includes("") && (splitFields[6].length == splitFields[4].length || splitFields[4].length == 1) && (splitFields[6].length == splitFields[5].length || splitFields[5].length == 1))
    {
        uploadNext(event, splitFields, 0);
    }
    else
    {
        document.getElementById("message_container").innerHTML = "<div class='alert alert-danger text-center' style='pointer-events: auto;' role='alert'><a href='#' class='pull-right fas fa-window-close' data-dismiss='alert'></a><strong>Error:</strong> Either the amount of files does not match names, volumes, chapters, or groups, or you left the group field empty. See instructions and try again. </div>.";
        console.log(splitFields);
    }
}

function splitInputs(fields) // splits the coma separated fields into arrays
{
    var chapterNameList = fields[0].value.split("\n");
    var volumeNumberList = fields[1].value.split("\n");
    var chapterNumberList = fields[2].value.split("\n");
    var group1List = fields[3].value.split("\n");
    var group2List = fields[4].value.split("\n");
    var group3List = fields[5].value.split("\n");
    var fileList = fields[6].files;
    for(let i = 0; i < chapterNameList.length; i++)
    {
        chapterNameList[i] = chapterNameList[i].trim();
    }
    for(let i = 0; i < volumeNumberList.length; i++)
    {
        volumeNumberList[i] = volumeNumberList[i].trim();
    }
    for(let i = 0; i < chapterNumberList.length; i++)
    {
        chapterNumberList[i] = chapterNumberList[i].trim();
    }
    for(let i = 0; i < group1List.length; i++)
    {
        group1List[i] = group1List[i].trim();
    }
    for(let i = 0; i < group2List.length; i++)
    {
        group2List[i] = group2List[i].trim();
    }
    for(let i = 0; i < group3List.length; i++)
    {
        group3List[i] = group3List[i].trim();
    }
    return [chapterNameList, volumeNumberList, chapterNumberList, group1List, group2List, group3List, fileList];
}

function uploadNext(event, splitFields, i)
{
    event.preventDefault();

    var chapterNameList = splitFields[0];
    var volumeNumberList = splitFields[1];
    var chapterNumberList = splitFields[2];
    var group1List = splitFields[3];
    var group2List = splitFields[4];
    var group3List = splitFields[5];
    var fileList = splitFields[6];

    splitFormData = new FormData(); //create new form data
    splitFormData.append("manga_id", document.getElementById("manga_id").value);
    if(chapterNameList.length == 1) //equal chapter names
    {
        splitFormData.append("chapter_name", chapterNameList[0]);
    }
    else //unequal chapter names
    {
        splitFormData.append("chapter_name", chapterNameList[i]);
    }
    if(volumeNumberList.length == 1) //single volume upload
    {
        splitFormData.append("volume_number", volumeNumberList[0]);
    }
    else //multi volume upload
    {
        splitFormData.append("volume_number", volumeNumberList[i]);
    }
    if(chapterNumberList.length == 1) //sequential chapter upload
    {
        if(isNaN(parseFloat(chapterNumberList[0]))) //only use increment if is number
        {
            splitFormData.append("chapter_number", chapterNumberList[0]);
        }
        else
        {
            splitFormData.append("chapter_number", parseFloat(chapterNumberList[0]) + i);
        }
    }
    else //listed chapter upload
    {
        splitFormData.append("chapter_number", chapterNumberList[i]);
    }
    if(document.getElementById("mass_group_delay").checked) //if group delay
    {
        splitFormData.append("group_delay", "true");
    }
    if(group1List.length == 1) //single group1 upload
    {
        splitFormData.append("group_id", group1List[0]);
    }
    else //multi group1 upload
    {
        splitFormData.append("group_id", group1List[i]);
    }
    if(group2List.length == 1) //single group2 upload
    {
        splitFormData.append("group_id_2", group2List[0]);
    }
    else //multi group2 upload
    {
        splitFormData.append("group_id_2", group2List[i]);
    }
    if(group3List.length == 1) //single group3 upload
    {
        splitFormData.append("group_id_3", group3List[0]);
    }
    else //multi group3 upload
    {
        splitFormData.append("group_id_3", group3List[i]);
    }
    if(document.getElementById("lang_id").options[document.getElementById("lang_id").selectedIndex].value == "") //I wouldn't need this if else statement if not for fucking Safari
    {
        splitFormData.append("lang_id", "1");
    }
    else
    {
        splitFormData.append("lang_id", document.getElementById("lang_id").options[document.getElementById("lang_id").selectedIndex].value);
    }
    splitFormData.append("file", fileList[i]);

    //fill in bottom form so uploader can see what's being uploaded
    if(chapterNameList.length == 1)
    {
        document.getElementById("chapter_name").value = chapterNameList[0];
    }
    else
    {
        document.getElementById("chapter_name").value = chapterNameList[i];
    }
    if(volumeNumberList.length == 1)
    {
        document.getElementById("volume_number").value = volumeNumberList[0];
    }
    else
    {
        document.getElementById("volume_number").value = volumeNumberList[i];
    }
    if(chapterNumberList.length == 1)
    {
        if(isNaN(parseFloat(chapterNumberList[0])))
        {
            document.getElementById("chapter_number").value = chapterNumberList[0];
        }
        else
        {
            document.getElementById("chapter_number").value = parseFloat(chapterNumberList[0]) + i;
        }
    }
    else
    {
        document.getElementById("chapter_number").value = chapterNumberList[i];
    }
    if(group1List.length == 1)
    {
        document.getElementById("group_id").previousSibling.previousSibling.childNodes[0].innerHTML = " id: " + group1List[0];
    }
    else
    {
        document.getElementById("group_id").previousSibling.previousSibling.childNodes[0].innerHTML = " id: " + group1List[i];
    }
    if(group2List.length == 1)
    {
        document.getElementById("group_id_2").previousSibling.previousSibling.childNodes[0].innerHTML = " id: " + group2List[0];
    }
    else
    {
        document.getElementById("group_id_2").previousSibling.previousSibling.childNodes[0].innerHTML = " id: " + group2List[i];
    }
    if(group3List.length == 1)
    {
        document.getElementById("group_id_3").previousSibling.previousSibling.childNodes[0].innerHTML = " id: " + group3List[0];
    }
    else
    {
        document.getElementById("group_id_3").previousSibling.previousSibling.childNodes[0].innerHTML = " id: " + group3List[i];
    }
    document.getElementById("file").parentNode.parentNode.previousSibling.previousSibling.value = fileList[i].name;

    var j = i+1; //for printing purposes only
    var success_msg = "<div class='alert alert-success text-center' style='pointer-events: auto;' role='alert'><a href='#' class='pull-right fas fa-window-close' data-dismiss='alert'></a><strong>Success:</strong> " + j + "/" + fileList.length + " chapters have been uploaded.</div>";
    var error_msg = "<div class='alert alert-warning text-center' style='pointer-events: auto;' role='alert'><a href='#' class='pull-right fas fa-window-close' data-dismiss='alert'></a><strong>Warning:</strong> Something went wrong with your upload at " + j + "/" + fileList.length + " files. All previous files have been uploaded.</div>";

    var uploadButton = document.getElementById("upload_button"); //disable buttons
    uploadButton.childNodes[0].classList.replace("fa-upload", "fa-spinner");
    uploadButton.childNodes[0].classList.replace("fa-fw", "fa-pulse");
    uploadButton.childNodes[2].innerText = "Uploading...";
    uploadButton.setAttribute("disabled", "true");
    var massUploadButton = document.getElementById("mass_upload_button");
    massUploadButton.childNodes[0].classList.replace("fa-upload", "fa-spinner");
    massUploadButton.childNodes[0].classList.replace("fa-fw", "fa-pulse");
    massUploadButton.childNodes[1].innerText = "Mass Uploading: " + j + "/" + fileList.length;
    massUploadButton.setAttribute("disabled", "true");

    $.ajax({ //definitely not copypasted from holo's upload code
        url: "/ajax/actions.ajax.php?function=chapter_upload",
        type: 'POST',
        data: splitFormData,
        cache: false,
        contentType: false,
        processData: false,

        xhr: function() {
            var myXhr = $.ajaxSettings.xhr();
            if (myXhr.upload) {
                myXhr.upload.addEventListener('progress', function(e) {
                    console.log(e);
                    if (e.lengthComputable) {
                        $('#progressbar').parent().show();
                        $('#progressbar').width((Math.round(e.loaded/e.total*100) + '%'));
                    }
                } , false);
            }
            return myXhr;
        },

        success: function (data) {
            $('#progressbar').parent().hide();
            $('#progressbar').width('0%');
            if (!data)
            {
                document.getElementById("message_container").innerHTML = success_msg;

                i++;
                if(i < fileList.length) //upload next after 0.0 seconds fuck you eva
                {
                    uploadNext(event, splitFields, i);
                }
                else
                {
                    uploadButton.childNodes[0].classList.replace("fa-spinner", "fa-upload"); //enable buttons
                    uploadButton.childNodes[0].classList.replace("fa-pulse", "fa-fw");
                    uploadButton.childNodes[2].innerText = "Upload";
                    uploadButton.removeAttribute("disabled");
                    massUploadButton.childNodes[0].classList.replace("fa-spinner", "fa-upload");
                    massUploadButton.childNodes[0].classList.replace("fa-pulse", "fa-fw");
                    massUploadButton.childNodes[1].innerText = "Mass Upload";
                    massUploadButton.removeAttribute("disabled");
                    document.getElementById("upload_form").reset(); //self explanatory
                    document.getElementById("mass_upload_form").reset();
                }
            }
            else
            {
                uploadButton.childNodes[0].classList.replace("fa-spinner", "fa-upload"); //enable buttons
                uploadButton.childNodes[0].classList.replace("fa-pulse", "fa-fw");
                uploadButton.childNodes[2].innerText = "Upload";
                uploadButton.removeAttribute("disabled");
                massUploadButton.childNodes[0].classList.replace("fa-spinner", "fa-upload");
                massUploadButton.childNodes[0].classList.replace("fa-pulse", "fa-fw");
                massUploadButton.childNodes[1].innerText = "Mass Upload";
                massUploadButton.removeAttribute("disabled");
                document.getElementById("message_container").innerHTML = data;
                document.getElementById("message_container").childNodes[0].style.pointerEvents = "auto";
                document.getElementById("message_container").childNodes[0].innerHTML += "<a href='#' class='pull-right fas fa-window-close' data-dismiss='alert'></a>";
                document.getElementById("message_container").innerHTML += error_msg;
            }
        },

        error: function(err) {
            console.error(err);
            $('#progressbar').parent().hide();
            uploadButton.childNodes[0].classList.replace("fa-spinner", "fa-upload"); //enable buttons
            uploadButton.childNodes[0].classList.replace("fa-pulse", "fa-fw");
            uploadButton.childNodes[2].innerText = "Upload";
            uploadButton.removeAttribute("disabled");
            massUploadButton.childNodes[0].classList.replace("fa-spinner", "fa-upload");
            massUploadButton.childNodes[0].classList.replace("fa-pulse", "fa-fw");
            massUploadButton.childNodes[1].innerText = "Mass Upload";
            massUploadButton.removeAttribute("disabled");
            document.getElementById("message_container").innerHTML = error_msg;
        }
    });
}

createForm();