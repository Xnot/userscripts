// ==UserScript==
// @name         Mangadex (shitty) Mass Uploader
// @namespace    https://github.com/LucasPratas/userscripts
// @version      1.80
// @icon         https://mangadex.com/favicon.ico
// @description  try to get green!
// @author       Xnot
// @updateURL    https://github.com/LucasPratas/userscripts/raw/master/mangadex-massuploader.user.js
// @downloadURL  https://github.com/LucasPratas/userscripts/raw/master/mangadex-massuploader.user.js
// @match        https://mangadex.com/upload/*
// @grant        none
// ==/UserScript==

function createForm() //creates mass upload form
{
    var userscriptInfo = document.createElement("div"); //info panel with userscript instructions
    userscriptInfo.classList.add("alert", "alert-info");
    userscriptInfo.setAttribute("role", "alert");
    userscriptInfo.innerHTML = "<h4>You are using Mangadex (shitty) Mass Uploader™ by Xnot</h4>" +
    "<ol><li>Insert chapter names,volume numbers, chapter numbers, and group IDs into their respective fields. Each line is one chapter" +
    "<br />Alternatively, inputing a single name/volume/groupID/non-numerical ch.number will use that for all uploads, and inputing a single numerical chapter will increment it for each upload" +
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
    "Update 1.70:" +
    "<ul><li>Added support for joint groups (Group 2 and Group 3 fields)</ul>" +
    "Update 1.80:" +
    "<ul><li>Changed a bunch of code from when I didn't know what I was doing (not that I do now) so that it hopefully breaks less when Holo changes stuff" +
    "<li>All fields are now textareas and are split by line instead of -," +
    "<li>All messages are no longer on a timer and are manually dismissable (messages from Holo are still on a timer)" +
    "<li>Attempting to use chapter auto-increment with a non-numerical chapter number will just use that value for all uploads instead of making all uploads NaN";
    var container = document.getElementById("content");
    container.insertBefore(userscriptInfo, container.getElementsByClassName("panel panel-default")[1]); //insert info panel

    document.getElementById("message_container").classList.replace("display-none", "display-block");

    var uploadForm = document.getElementById("upload_form"); //get real upload form
    var massUploadForm = uploadForm.cloneNode(true); //create mass upload form as clone of upload form
    massUploadForm.id = "mass_upload_form";
    container.getElementsByClassName("panel-body")[1].insertBefore(massUploadForm, uploadForm); //insert mass upload form

    //modify chapter name field
    var chapterNameField = document.createElement("textarea");
    document.getElementById("chapter_name").replaceWith(chapterNameField);
    chapterNameField.classList.add("form-control");
    chapterNameField.setAttribute("id", "chapter_names");
    chapterNameField.setAttribute("name", "chapter_names");
    chapterNameField.setAttribute("placeholder", "nameForCh1\nnameForCh2\nnameForCh3");
    var chapterNameLabel = chapterNameField.parentNode.previousSibling.previousSibling;
    chapterNameLabel.setAttribute("for", "chapter_names");
    chapterNameLabel.innerText = "Chapter Names";

    //modify volume field
    var volumeNumberField = document.createElement("textarea");
    document.getElementById("volume_number").replaceWith(volumeNumberField);
    volumeNumberField.classList.add("form-control");
    volumeNumberField.setAttribute("id", "volume_numbers");
    volumeNumberField.setAttribute("name", "volume_numbers");
    volumeNumberField.setAttribute("placeholder", "volumeForCh1\nvolumeForCh2\nvolumeForCh3");
    var volumeNumberLabel = volumeNumberField.parentNode.previousSibling.previousSibling;
    volumeNumberLabel.setAttribute("for", "volume_numbers");
    volumeNumberLabel.innerText = "Volume Numbers";

    //modify chapter number field
    var chapterNumberField = document.createElement("textarea");
    document.getElementById("chapter_number").replaceWith(chapterNumberField);
    chapterNumberField.classList.add("form-control");
    chapterNumberField.setAttribute("id", "chapter_numbers");
    chapterNumberField.setAttribute("name", "chapter_numbers");
    chapterNumberField.setAttribute("placeholder", "ch1\nch2\nch3");
    var chapterNumberLabel = chapterNumberField.parentNode.previousSibling.previousSibling;
    chapterNumberLabel.setAttribute("for", "chapter_numbers");
    chapterNumberLabel.innerText = "Chapter Numbers";

    //modify delay field
    var delayCheckbox = document.getElementById("group_delay");
    delayCheckbox.setAttribute("id", "groups_delay");
    delayCheckbox.setAttribute("name", "groups_delay");
    var delayLabel = delayCheckbox.parentNode.parentNode.parentNode.previousSibling.previousSibling;
    delayLabel.setAttribute("for", "groups_delay");
    delayLabel.innerText = "Apply groups delay";
    delayCheckbox.addEventListener("click", function()
                                            {
                                                document.getElementById("group_delay").checked = this.checked;
                                            });
    

    //modify the group 1 field
    var group1Field = document.createElement("textarea");
    document.getElementById("group_id").parentNode.replaceWith(group1Field);
    group1Field.classList.add("form-control");
    group1Field.setAttribute("id", "groups_id");
    group1Field.setAttribute("name", "groups_id");
    group1Field.setAttribute("placeholder", "Use dropdown in the bottom form or insert group IDs (NOT NAME) here");
    var group1Label = group1Field.parentNode.previousSibling.previousSibling;
    group1Label.setAttribute("for", "groups_id");
    group1Label.innerText = "Groups 1";
    document.getElementById("group_id").addEventListener("change", function()
                                                                    {
                                                                        group1Field.value = this.value;
                                                                        this.previousSibling.previousSibling.childNodes[0].childNodes[1].data += " id: " + this.value;
                                                                    });

    //modify the group 2 field
    var group2Field = document.createElement("textarea");
    document.getElementById("group_id_2").parentNode.replaceWith(group2Field);
    group2Field.classList.add("form-control");
    group2Field.setAttribute("id", "groups_id_2");
    group2Field.setAttribute("name", "groups_id_2");
    group2Field.setAttribute("placeholder", "Use dropdown in the bottom form or insert group IDs (NOT NAME) here");
    var group2Label = group2Field.parentNode.previousSibling.previousSibling;
    group2Label.setAttribute("for", "groups_id_2");
    group2Label.innerText = "Groups 2";
    document.getElementById("group_id_2").addEventListener("change", function()
                                                                    {
                                                                        group2Field.value = this.value;
                                                                        this.previousSibling.previousSibling.childNodes[0].childNodes[1].data += " id: " + this.value;
                                                                    });

    //modify the group 3 field
    var group3Field = document.createElement("textarea");
    document.getElementById("group_id_3").parentNode.replaceWith(group3Field);
    group3Field.classList.add("form-control");
    group3Field.setAttribute("id", "groups_id_3");
    group3Field.setAttribute("name", "groups_id_3");
    group3Field.setAttribute("placeholder", "Use dropdown in the bottom form or insert group IDs (NOT NAME) here");
    var group3Label = group3Field.parentNode.previousSibling.previousSibling;
    group3Label.setAttribute("for", "groups_id_3");
    group3Label.innerText = "Groups 3";
    document.getElementById("group_id_3").addEventListener("change", function()
                                                                    {
                                                                        group3Field.value = this.value;
                                                                        this.previousSibling.previousSibling.childNodes[0].childNodes[1].data += " id: " + this.value;
                                                                    });

    //modify the language field
    var languageField = document.createElement("textarea"); //clone a non-dropdown because fuck that
    document.getElementById("lang_id").parentNode.replaceWith(languageField);
    languageField.setAttribute("id", "langs_id");
    languageField.setAttribute("name", "langs_id");
    languageField.setAttribute("disabled", "true");
    languageField.setAttribute("placeholder", "not implemented because no one mass uploads multiple languages, fill in the language in the bottom form instead");
    var languageLabel = languageField.parentNode.previousSibling.previousSibling;
    languageLabel.setAttribute("for", "langs_id");
    languageLabel.innerText = "Languages";
    

    //modify the file field
    var fileField = document.getElementById("file");
    fileField.setAttribute("id", "files");
    fileField.setAttribute("name", "files");
    fileField.setAttribute("multiple", "");
    var fileText = fileField.parentNode.parentNode.previousSibling.previousSibling;
    fileText.setAttribute("placeholder", "No files selected");
    var fileLabel = fileField.parentNode.parentNode.parentNode.parentNode.previousSibling.previousSibling;
    fileLabel.setAttribute("for", "files");
    fileLabel.innerText = "Files";
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

    //modify buttons
    var uploadButton = document.getElementById("upload_button");
    var uploadButtonContainer = uploadButton.parentNode;
    uploadButtonContainer.parentNode.removeChild(uploadButtonContainer.previousSibling.previousSibling); //delete redundant back button
    uploadButtonContainer.classList.replace("col-sm-6", "col-sm-12"); //make upload button container occupy space previously occupied by back button container
    uploadButtonContainer.classList.add("btn-toolbar"); //need muh button spacing
    uploadButton.setAttribute("type", "button");
    uploadButton.classList.replace("btn-default", "btn-success");
    uploadButton.classList.add("pull-right");
    uploadButton.setAttribute("id", "mass_upload_button");
    uploadButton.childNodes[2].innerText = "Mass Upload";
    uploadButton.addEventListener("click", function(event)
                                            {
                                                massUpload(event, [chapterNameField, volumeNumberField, chapterNumberField, group1Field, group2Field, group3Field, fileField]);
                                            });
    var resetButton = uploadButton.cloneNode(true);
    resetButton.setAttribute("type", "reset");
    resetButton.setAttribute("id", "mass_reset_button");
    resetButton.classList.replace("btn-success", "btn-warning");
    resetButton.childNodes[0].classList.replace("fa-upload", "fa-trash-alt");
    resetButton.childNodes[2].innerText = "Reset Form";
    uploadButtonContainer.appendChild(resetButton);
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
    splitFormData.append("group_delay", document.getElementById("groups_delay").checked);
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
    if(document.getElementById("lang_id").value == "") //I wouldn't need this if else statement if not for fucking Safari
    {
        splitFormData.append("lang_id", "1");
    }
    else
    {
        splitFormData.append("lang_id", document.getElementById("lang_id").value);
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
            document.getElementById("chapter_number").value = parseInt(chapterNumberList[0]) + i;
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
    massUploadButton.childNodes[2].innerText = "Mass Uploading: " + j + "/" + fileList.length;
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
            }
            else
            {
                document.getElementById("message_container").innerHTML = data;
            }
            i++;
            if(i < fileList.length) //upload next after 0.5 seconds
            {
                setTimeout(function(){uploadNext(event, splitFields, i);}, 500);
            }
            else
            {
                uploadButton.childNodes[0].classList.replace("fa-spinner", "fa-upload"); //enable buttons
                uploadButton.childNodes[0].classList.replace("fa-pulse", "fa-fw");
                uploadButton.childNodes[2].innerText = "Upload";
                uploadButton.removeAttribute("disabled");
                massUploadButton.childNodes[0].classList.replace("fa-spinner", "fa-upload");
                massUploadButton.childNodes[0].classList.replace("fa-pulse", "fa-fw");
                massUploadButton.childNodes[2].innerText = "Mass Upload";
                massUploadButton.removeAttribute("disabled");
                document.getElementById("upload_form").reset(); //self explanatory
                document.getElementById("mass_upload_form").reset();
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
            massUploadButton.childNodes[2].innerText = "Mass Upload";
            massUploadButton.removeAttribute("disabled");
            document.getElementById("message_container").innerHTML = error_msg;
        }
    });
}

createForm();