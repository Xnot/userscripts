// ==UserScript==
// @name         Mangadex (shitty) Mass Uploader
// @namespace    https://github.com/LucasPratas/userscripts
// @version      1.72
// @icon         https://mangadex.com/favicon.ico
// @description  try to get green!
// @author       Xnot
// @updateURL    https://github.com/LucasPratas/userscripts/raw/master/mangadex-massuploader.user.js
// @downloadURL  https://github.com/LucasPratas/userscripts/raw/master/mangadex-massuploader.user.js
// @match        https://mangadex.com/upload/*
// @grant        none
// ==/UserScript==

function createForm() //creates mass upload form and returns all input fields
{
    var myUserscriptInfo = document.createElement("div");
    myUserscriptInfo.classList.add("alert", "alert-info");
    myUserscriptInfo.setAttribute("role", "alert");
    myUserscriptInfo.innerHTML = "<h4>You are using Mangadex (shitty) Mass Uploader™ by Xnot</h4>" +
    "<ol><li>Insert chapter names,volume numbers, and chapter numbers, and group IDs separated by a dash followed by a coma (-,) into their respective fields" +
    "<br />Protip: use TEXTJOIN(CONCAT(UNICHAR(45),UNICHAR(44)),0 ,ROWSHERE) on excel" +
    "<br />Alternatively, inputing a single name/volume/groupID will use that for all uploads, and inputing a single chapter will increment it for each upload" +
    "<br />Obviously only use those options if there is only one volume/group/if there are no special chapters in your files" +
    "<br />If you want a chapter to have an empty title or whatever leave an empty value in the respective field (c1-,c2-,-,c4) except for Group 1, every chapter MUST have a Group 1" +
    "<br />You can find group IDs by selecting the group in dropdown in the bottom or by looking at the URL of that group's page" +
    "<li>Check the group delay box if you feel so inclined (will apply for all uploads)" +
    "<li>Click browse and use shift/ctrl so select all files" +
    "<br />If you hover over the browse button you can check that the order of the files is correct" +
    "<li>Select language from the standard upload form below the mass upload form" +
    "<li>Click the Mass Upload button" +
    "<li>If you realized you've fucked up halfway through, just close the tab or something, cause I have no idea how to make a cancel button and Holo didn't make one for me to rip off</ol>" +
    "If there are any problems @ or pm me on Discord<br />" +
    "Update 1.67:" +
    "<ul><li>Added proper support for group delay" +
    "<li>I don't think it's important enough to warrant a multi field so it'll just apply delay to all uploads</ul>" +
    "Update 1.70:" +
    "<ul><li>Added support for joint groups (Group 2 and Group 3 fields)";
    var container = document.getElementById("content");
    var formPanel = document.getElementsByClassName("panel panel-default")[1];
    container.insertBefore(myUserscriptInfo, formPanel);


    var uploadForm = document.getElementById("upload_form"); //get real upload form
    var massUploadForm = uploadForm.cloneNode(true); //create mass upload form as clone of upload form
    //uploadForm.style = "margin-top: 15px; display: none"; //hide upload form
    massUploadForm.id = "mass_upload_form";
    document.getElementsByClassName("panel-body")[1].insertBefore(massUploadForm, uploadForm); //insert mass upload form

    //var mangaNameGroup = massUploadForm.childNodes[1];
    var chapterNumberGroup = massUploadForm.childNodes[7];
    var delayGroup = massUploadForm.childNodes[9];
    var group1Group = massUploadForm.childNodes[11];
    var group2Group = massUploadForm.childNodes[13];
    var group3Group = massUploadForm.childNodes[15];
    var languageGroup = massUploadForm.childNodes[17];
    var fileGroup = massUploadForm.childNodes[19];
    var buttonsGroup = massUploadForm.childNodes[21];

    //modify chapter name field
    var chapterNameField = document.getElementById("chapter_name");
    chapterNameField.setAttribute("id", "chapter_names");
    chapterNameField.setAttribute("name", "chapter_names");
    chapterNameField.setAttribute("placeholder", "nameForCh1-, nameForCh2-, nameForCh3");
    var chapterNameLabel = chapterNameField.parentNode.previousSibling.previousSibling;
    chapterNameLabel.setAttribute("for", "chapter_names");
    chapterNameLabel.innerHTML = "Chapter Names";

    //modify volume field
    var volumeNumberField = document.getElementById("volume_number");
    volumeNumberField.setAttribute("id", "volume_numbers");
    volumeNumberField.setAttribute("name", "volume_numbers");
    volumeNumberField.setAttribute("placeholder", "volumeForCh1-, volumeForCh2-, volumeForCh3");
    var volumeNumberLabel = volumeNumberField.parentNode.previousSibling.previousSibling;
    volumeNumberLabel.setAttribute("for", "volume_numbers");
    volumeNumberLabel.innerHTML = "Volume Numbers";

    //modify chapter number field
    var chapterNumberField = document.getElementById("chapter_number");
    chapterNumberField.setAttribute("id", "chapter_numbers");
    chapterNumberField.setAttribute("name", "chapter_numbers");
    chapterNumberField.setAttribute("placeholder", "ch1-, ch2-, ch3");
    var chapterNumberLabel = chapterNumberField.parentNode.previousSibling.previousSibling;
    chapterNumberLabel.setAttribute("for", "chapter_numbers");
    chapterNumberLabel.innerHTML = "Chapter Numbers";

    //modify delay field
    var delayCheckbox = document.getElementById("group_delay");
    delayCheckbox.setAttribute("id", "groups_delay");
    delayCheckbox.setAttribute("name", "groups_delay");
    var delayLabel = delayCheckbox.parentNode.parentNode.parentNode.previousSibling.previousSibling;
    delayLabel.setAttribute("for", "groups_delay");
    delayLabel.innerHTML = "Apply groups delay";
    

    //modify the group 1 field
    var group1Field = group1Group.childNodes[3].childNodes[1];
    group1Group.replaceWith(chapterNumberGroup.cloneNode(true)); //clone a non-dropdown because fuck that
    group1Field.setAttribute("id", "groups_id");
    group1Field.setAttribute("name", "groups_id");
    group1Field.setAttribute("placeholder", "Use dropdown in the bottom form or insert group IDs (NOT NAME) here");
    group1Group = massUploadForm.childNodes[11]; //why doesn't replace funcion update the pointer
    var group1Label = group1Group.childNodes[1];
    group1Label.setAttribute("for", "groups_id");
    group1Label.innerHTML = "Groups 1";
    document.getElementById("group_id").addEventListener("change", function()
                                                                    {
                                                                        group1Field.value = this.value;
                                                                        this.previousSibling.previousSibling.childNodes[0].childNodes[1].data += " id: " + this.value;
                                                                    });

    //modify the group 2 field
    group2Group.replaceWith(chapterNumberGroup.cloneNode(true)); //clone a non-dropdown because fuck that
    group2Group = massUploadForm.childNodes[13]; //why doesn't replace funcion update the pointer
    var group2Label = group2Group.childNodes[1];
    group2Label.setAttribute("for", "groups_id_2");
    group2Label.innerHTML = "Groups 2";
    var group2Field = group2Group.childNodes[3].childNodes[1];
    group2Field.setAttribute("id", "groups_id_2");
    group2Field.setAttribute("name", "groups_id_2");
    group2Field.setAttribute("placeholder", "Use dropdown in the bottom form or insert group IDs (NOT NAME) here");
    document.getElementById("group_id_2").addEventListener("change", function()
                                                                    {
                                                                        group2Field.value = this.value;
                                                                        this.previousSibling.previousSibling.childNodes[0].childNodes[1].data += " id: " + this.value;
                                                                    });

    //modify the group 3 field
    group3Group.replaceWith(chapterNumberGroup.cloneNode(true)); //clone a non-dropdown because fuck that
    group3Group = massUploadForm.childNodes[15]; //why doesn't replace funcion update the pointer
    var group3Label = group3Group.childNodes[1];
    group3Label.setAttribute("for", "groups_id_3");
    group3Label.innerHTML = "Groups 3";
    var group3Field = group3Group.childNodes[3].childNodes[1];
    group3Field.setAttribute("id", "groups_id_3");
    group3Field.setAttribute("name", "groups_id_3");
    group3Field.setAttribute("placeholder", "Use dropdown in the bottom form or insert group IDs (NOT NAME) here");
    document.getElementById("group_id_3").addEventListener("change", function()
                                                                    {
                                                                        group3Field.value = this.value;
                                                                        this.previousSibling.previousSibling.childNodes[0].childNodes[1].data += " id: " + this.value;
                                                                    });

    //modify the language field
    languageGroup.replaceWith(chapterNumberGroup.cloneNode(true)); //clone a non-dropdown because fuck that
    languageGroup = massUploadForm.childNodes[17]; //why doesn't replace funcion update the pointer
    var languageLabel = languageGroup.childNodes[1];
    languageLabel.setAttribute("for", "langs_id");
    languageLabel.innerHTML = "Languages";
    var languageField = languageGroup.childNodes[3].childNodes[1];
    languageField.setAttribute("id", "langs_id");
    languageField.setAttribute("name", "langs_id");
    languageField.setAttribute("disabled", "");
    languageField.setAttribute("placeholder", "not implemented because no one mass uploads multiple languages, fill in the language in the bottom form instead");

    //modify the file field
    var fileLabel = fileGroup.childNodes[1];
    fileLabel.setAttribute("for", "files");
    fileLabel.innerHTML = "Files";
    var fileText = fileGroup.childNodes[3].childNodes[1].childNodes[1];
    fileText.setAttribute("placeholder", "No files selected");
    var fileField = fileGroup.childNodes[3].childNodes[1].childNodes[3].childNodes[1].childNodes[5];
    fileField.setAttribute("id", "files");
    fileField.setAttribute("name", "files");
    fileField.setAttribute("multiple", "");
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
    buttonsGroup.removeChild(buttonsGroup.childNodes[1]); //delete redundant back button
    var uploadButtonContainer = buttonsGroup.childNodes[2]; //modify upload button
    uploadButtonContainer.classList.replace("col-sm-6", "col-sm-12"); 
    uploadButtonContainer.classList.add("btn-toolbar");
    var uploadButton = uploadButtonContainer.childNodes[1];
    uploadButton.setAttribute("type", "button");
    uploadButton.classList.replace("btn-default", "btn-success");
    uploadButton.classList.add("pull-right");
    uploadButton.setAttribute("id", "mass_upload_button");
    uploadButton.childNodes[2].innerHTML = "Mass Upload";
    uploadButton.addEventListener("click", function(event)
                                            {
                                                massUpload(event, [chapterNameField, volumeNumberField, chapterNumberField, delayCheckbox, group1Field, group2Field, group3Field, fileField]);
                                            });
    var resetButton = uploadButton.cloneNode(true);
    resetButton.setAttribute("type", "reset");
    resetButton.setAttribute("id", "mass_reset_button");
    resetButton.classList.replace("btn-success", "btn-warning");
    resetButton.childNodes[0].classList.replace("fa-upload", "fa-trash-alt");
    resetButton.childNodes[2].innerHTML = "Reset Form";
    uploadButtonContainer.appendChild(resetButton);
}

function massUpload(event, fields)
{
    var splitFields = splitInputs(fields);
    //this if statement is getting really long
    if((splitFields[7].length == splitFields[0].length || splitFields[0].length == 1) && (splitFields[7].length == splitFields[1].length || splitFields[1].length == 1) && (splitFields[7].length == splitFields[2].length || splitFields[2].length == 1) && (splitFields[7].length == splitFields[4].length || splitFields[4].length == 1) && !splitFields[4].includes("") && (splitFields[7].length == splitFields[5].length || splitFields[5].length == 1) && (splitFields[7].length == splitFields[6].length || splitFields[6].length == 1))
    {
        uploadNext(event, splitFields, 0);
    }
    else
    {
        $("#message_container").html("<div class='alert alert-danger text-center' role='alert'><strong>Warning:</strong> Either the amount of files does not match names, volumes, chapters, or groups, or you left the group field empty. See instructions and try again. </div>.").show().delay(4000).fadeOut();
        console.log(splitFields);
    }
}

function splitInputs(fields) // splits the coma separated fields into arrays
{
    var chapterNameList = fields[0].value.split("-,");
    var volumeNumberList = fields[1].value.split("-,");
    var chapterNumberList = fields[2].value.split("-,");
    var delayList = fields[3].checked;
    var group1List = fields[4].value.split("-,");
    var group2List = fields[5].value.split("-,");
    var group3List = fields[6].value.split("-,");
    var fileList = fields[7].files;
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
    return [chapterNameList, volumeNumberList, chapterNumberList, delayList, group1List, group2List, group3List, fileList];
}

function uploadNext(event, splitFields, i)
{
    var uploadForm = document.getElementById("upload_form"); //real upload form
    var massUploadForm = document.getElementById("mass_upload_form");

    var mangaIdField = uploadForm.childNodes[1].childNodes[3].childNodes[3];
    var chapterNameField = uploadForm.childNodes[3].childNodes[3].childNodes[1];
    var volumeNumberField = uploadForm.childNodes[5].childNodes[3].childNodes[1];
    var chapterNumberField = uploadForm.childNodes[7].childNodes[3].childNodes[1];
    var delayCheckbox = uploadForm.childNodes[9].childNodes[3].childNodes[1].childNodes[1].childNodes[0];
    var group1Field = uploadForm.childNodes[11].childNodes[3].childNodes[1];
    var group2Field = uploadForm.childNodes[13].childNodes[3].childNodes[1];
    var group3Field = uploadForm.childNodes[15].childNodes[3].childNodes[1];
    var languageGroup = uploadForm.childNodes[17];
    var fileField = uploadForm.childNodes[19].childNodes[3].childNodes[1].childNodes[3].childNodes[1].childNodes[5];
    var fileText = uploadForm.childNodes[19].childNodes[3].childNodes[1].childNodes[1];
    var uploadButton = uploadForm.childNodes[21].childNodes[3].childNodes[1];

    var chapterNameList = splitFields[0];
    var volumeNumberList = splitFields[1];
    var chapterNumberList = splitFields[2];
    var delayList = splitFields[3];
    var group1List = splitFields[4];
    var group2List = splitFields[5];
    var group3List = splitFields[6];
    var fileList = splitFields[7];

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
        splitFormData.append("chapter_number", parseInt(chapterNumberList[0]) + i);
    }
    else //listed chapter upload
    {
        splitFormData.append("chapter_number", chapterNumberList[i]);
    }
    splitFormData.append("group_delay", delayList);
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
    if(document.getElementById("lang_id").value == "")
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
        document.getElementById("chapter_number").value = parseInt(chapterNumberList[0]) + i;
    }
    else
    {
        document.getElementById("chapter_number").value = chapterNumberList[i];
    }
    delayCheckbox.checked = delayList;
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
    fileText.value = fileList[i].name;

    var j = i+1; //for printing purposes only
    var success_msg = "<div class='alert alert-success text-center' role='alert'><strong>Success:</strong> " + j + "/" + fileList.length + " chapters have been uploaded.</div>";
    var error_msg = "<div class='alert alert-warning text-center' role='alert'><strong>Warning:</strong> Something went wrong with your upload at " + j + "/" + fileList.length + " files. All previous files have been uploaded.</div>";
 
    $("#upload_button").html("<span class='fas fa-spinner fa-pulse' aria-hidden='true' title=''></span> Uploading...").attr("disabled", true);
    $("#mass_upload_button").html("<span class='fas fa-spinner fa-pulse' aria-hidden='true' title=''></span> Mass Uploading: " + j + "/" + fileList.length).attr("disabled", true);

    event.preventDefault();
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
            if (!data) {
                $("#message_container").html(success_msg).show().delay(3000).fadeOut();
            }
            else {
                $("#message_container").html(data).show().delay(3000).fadeOut();
            }
            i++;
            if(i < fileList.length) //upload next after 0.5 seconds
            {
                setTimeout(function() { uploadNext(event, splitFields, i); }, 500);
            }
            else
            {
                $("#upload_button").html("<span class='fas fa-upload fa-fw' aria-hidden='true' title=''></span> Upload").attr("disabled", false);
                $("#mass_upload_button").html("<span class='fas fa-upload fa-fw' aria-hidden='true' title=''></span> Mass Upload").attr("disabled", false);
                uploadForm.reset();
                massUploadForm.reset();
            }
        },
 
        error: function(err) {
            console.error(err);
            $('#progressbar').parent().hide();
            $("#upload_button").html("<span class='fas fa-upload fa-fw' aria-hidden='true' title=''></span> Upload").attr("disabled", false);
            $("#mass_upload_button").html("<span class='fas fa-upload fa-fw' aria-hidden='true' title=''></span> Mass Upload").attr("disabled", false);
            $("#message_container").html(error_msg).show().delay(3000).fadeOut();
        }
    });
}

createForm();