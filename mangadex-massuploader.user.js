// ==UserScript==
// @name         Mangadex (shitty) Mass Uploader
// @namespace    https://github.com/LucasPratas/userscripts
// @version      1.65
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
    myUserscriptInfo.setAttribute("class", "alert alert-info");
    myUserscriptInfo.setAttribute("role", "alert");
    myUserscriptInfo.innerHTML = "<h4>You are using (shitty) Mass Upload Userscript For Mangadex™ by Xnot</h4>" +
    "<ol><li>Insert chapter names,volume numbers, and chapter numbers separated by a dash followed by a coma (-,) into their respective fields" +
    "<br />Protip: use TEXTJOIN(CONCAT(UNICHAR(45),UNICHAR(44)),0 ,ROWSHERE) on excel" +
    "<br />Alternatively, inputing a single name/volume will use that for all uploads, and inputing a single chapter will increment it for each upload" +
    "<br />Obviously only use those options if there is only one volume/if there are no special chapters in your files" +
    "<li>Click browse and use shift/ctrl so select all files" +
    "<br />If you hover over the browse button you can check that the order of the files is correct" +
    "<li>Select group and language from the standard upload form below the mass upload form" +
    "Hopefully I can care enough to figure these out properly soon" +
    "<li>Click the Mass Upload button" +
    "<li>If you realized you've fucked up halfway through, just close the tab or something, cause I have no idea how to make a cancel button and Holo didn't make one for me to rip off</ol>" +
    "Update 1.5:" +
    "<ul><li>Both forms automatically reset upon completion" +
    "<li>Added reset button to top form</ul>" +
    "Update 1.6:" +
    "<ul><li>Leaving group empty now prevents you from uploading (better than getting Holo's nearly-invisible SQL injection error)" +
    "<li>Muli group is a thing now" +
    "<li>Selecting a group from the bottom dropdown shows that group's id and fills it on top form" +
    "<li>If you want multiple groups you'll have to note the ids and fill in the top form manually. Works in same pattern as the other fields" +
    "<li>Leaving only one group will use that for all uploads" +
    "<li>I'll update the instructions above to reflect these changes later, too lazy now</ul>";
    var container = document.getElementById("content");
    var formPanel = document.getElementsByClassName("panel panel-default")[1];
    container.insertBefore(myUserscriptInfo, formPanel);


    var uploadForm = document.getElementById("upload_form"); //get real upload form
    var massUploadForm = uploadForm.cloneNode(true); //create mass upload form as clone of upload form
    //uploadForm.style = "margin-top: 15px; display: none"; //hide upload form
    massUploadForm.id = "mass_upload_form";

    var mangaNameGroup = massUploadForm.childNodes[1];
    var chapterNameGroup = massUploadForm.childNodes[3];
    var volumeNumberGroup = massUploadForm.childNodes[5];
    var chapterNumberGroup = massUploadForm.childNodes[7];
    var delayGroup = massUploadForm.childNodes[9];
    var group1Group = massUploadForm.childNodes[11];
    var group2Group = massUploadForm.childNodes[13];
    var group3Group = massUploadForm.childNodes[15];
    var languageGroup = massUploadForm.childNodes[17];
    var fileGroup = massUploadForm.childNodes[19];
    var buttonsGroup = massUploadForm.childNodes[21];

    //modify chapter name field
    var chapterNameLabel = chapterNameGroup.childNodes[1];
    chapterNameLabel.setAttribute("for", "chapter_names");
    chapterNameLabel.innerHTML = "Chapter Names";
    var chapterNameField = chapterNameGroup.childNodes[3].childNodes[1];
    chapterNameField.setAttribute("id", "chapter_names");
    chapterNameField.setAttribute("name", "chapter_names");
    chapterNameField.setAttribute("placeholder", "nameForCh1-, nameForCh2-, nameForCh3");

    //modify volume field
    var volumeNumberLabel = volumeNumberGroup.childNodes[1];
    volumeNumberLabel.setAttribute("for", "volume_numbers");
    volumeNumberLabel.innerHTML = "Volume Numbers";
    var volumeNumberField = volumeNumberGroup.childNodes[3].childNodes[1];
    volumeNumberField.setAttribute("id", "volume_numbers");
    volumeNumberField.setAttribute("name", "volume_numbers");
    volumeNumberField.setAttribute("placeholder", "volumeForCh1-, volumeForCh2-, volumeForCh3");

    //modify chapter number field
    var chapterNumberLabel = chapterNumberGroup.childNodes[1];
    chapterNumberLabel.setAttribute("for", "chapter_numbers");
    chapterNumberLabel.innerHTML = "Chapter Numbers";
    var chapterNumberField = chapterNumberGroup.childNodes[3].childNodes[1];
    chapterNumberField.setAttribute("id", "chapter_numbers");
    chapterNumberField.setAttribute("name", "chapter_numbers");
    chapterNumberField.setAttribute("placeholder", "ch1-, ch2-, ch3");

    //modify the group 1 field
    group1Group.replaceWith(chapterNumberGroup.cloneNode(true)); //clone a non-dropdown because fuck that
    group1Group = massUploadForm.childNodes[11]; //why doesn't replace funcion update the pointer
    var group1Label = group1Group.childNodes[1];
    group1Label.setAttribute("for", "groups_id");
    group1Label.innerHTML = "Groups 1";
    var group1Field = group1Group.childNodes[3].childNodes[1];
    group1Field.setAttribute("id", "groups_id");
    group1Field.setAttribute("name", "groups_id");
    group1Field.setAttribute("placeholder", "Use dropdown in the bottom form or insert group IDs (NOT NAME) here");
    document.getElementById("group_id").addEventListener("change", function()
                                                                    {
                                                                        group1Field.value = this.value;
                                                                        document.getElementById("group_id").previousSibling.previousSibling.childNodes[0].childNodes[1].data += " id: " + this.value;
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
    group2Field.setAttribute("disabled", "");
    group2Field.setAttribute("placeholder", "not implemented by Holo");

    //modify the group 3 field
    group3Group.replaceWith(chapterNumberGroup.cloneNode(true)); //clone a non-dropdown because fuck that
    group3Group = massUploadForm.childNodes[15]; //why doesn't replace funcion update the pointer
    var group3Label = group3Group.childNodes[1];
    group3Label.setAttribute("for", "groups_id_3");
    group3Label.innerHTML = "Groups 3";
    var group3Field = group3Group.childNodes[3].childNodes[1];
    group3Field.setAttribute("id", "groups_id_3");
    group3Field.setAttribute("name", "groups_id_3");
    group3Field.setAttribute("disabled", "");
    group3Field.setAttribute("placeholder", "not implemented by Holo");

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
    languageField.setAttribute("placeholder", "not implemented because it's a pain in the ass and no one mass uploads multiple languages, fill in the language in the bottom form instead");

    //modify the file field
    var fileLabel = fileGroup.childNodes[1];
    fileLabel.setAttribute("for", "files");
    fileLabel.innerHTML = "Files";
    var fileText = fileGroup.childNodes[3].childNodes[1].childNodes[1];
    fileText.setAttribute("placeholder", "Filenames");
    var fileField = fileGroup.childNodes[3].childNodes[1].childNodes[3].childNodes[1].childNodes[5];
    fileField.setAttribute("id", "files");
    fileField.setAttribute("name", "files");
    fileField.setAttribute("multiple", "");
    fileField.addEventListener("change", function()
                                            {
                                                fileText.value = this.files.length + " file(s) selected";
                                                uploadButton.focus();
                                            });

    //modify buttons
    buttonsGroup.removeChild(buttonsGroup.childNodes[1]); //delete redundant back button
    var uploadButtonContainer = buttonsGroup.childNodes[2]; //modify upload button
    uploadButtonContainer.setAttribute("class", "col-sm-12 text-right btn-toolbar");
    var uploadButton = uploadButtonContainer.childNodes[1];
    uploadButton.setAttribute("type", "button");
    uploadButton.setAttribute("class", "pull-right btn btn-success");
    uploadButton.setAttribute("id", "mass_upload_button");
    uploadButton.childNodes[2].innerHTML = "Mass Upload";
    uploadButton.addEventListener("click", function(event)
                                            {
                                                massUpload(event, [chapterNameField, volumeNumberField, chapterNumberField, group1Field, fileField]);
                                            });
    var resetButton = uploadButton.cloneNode(true);
    resetButton.setAttribute("type", "reset");
    resetButton.setAttribute("id", "mass_reset_button");
    resetButton.setAttribute("class", "pull-right btn btn-warning");
    resetButton.childNodes[0].setAttribute("class", "fas fa-trash-alt");
    resetButton.childNodes[2].innerHTML = "Reset Form";
    uploadButtonContainer.appendChild(resetButton);

    document.getElementsByClassName("panel-body")[1].insertBefore(massUploadForm, uploadForm); //insert mass upload form
}

function massUpload(event, fields)
{
    var splitFields = splitInputs(fields);
    //this if statement is getting really long
    if((splitFields[4].length == splitFields[0].length || splitFields[0].length == 1) && (splitFields[4].length == splitFields[1].length || splitFields[1].length == 1) && (splitFields[4].length == splitFields[2].length || splitFields[2].length == 1) && (splitFields[4].length == splitFields[3].length || splitFields[3].length == 1) && !splitFields[3].includes(""))
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
    var group1List = fields[3].value.split("-,");
    var fileList = fields[4].files;
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
    return [chapterNameList, volumeNumberList, chapterNumberList, group1List, fileList];
}

function uploadNext(event, splitFields, i) //definitely not copypasted from holo's upload code
{
    var uploadForm = document.getElementById("upload_form"); //real upload form
    var massUploadForm = document.getElementById("mass_upload_form");

    var mangaIdField = uploadForm.childNodes[1].childNodes[3].childNodes[3];
    var chapterNameField = uploadForm.childNodes[3].childNodes[3].childNodes[1];
    var volumeNumberField = uploadForm.childNodes[5].childNodes[3].childNodes[1];
    var chapterNumberField = uploadForm.childNodes[7].childNodes[3].childNodes[1];
    var group1Field = uploadForm.childNodes[11].childNodes[3].childNodes[1];
    //var languageGroup = uploadForm.childNodes[13];
    var fileField = uploadForm.childNodes[19].childNodes[3].childNodes[1].childNodes[3].childNodes[1].childNodes[5];
    var fileText = uploadForm.childNodes[19].childNodes[3].childNodes[1].childNodes[1];
    var uploadButton = uploadForm.childNodes[21].childNodes[3].childNodes[1];

    var chapterNameList = splitFields[0];
    var volumeNumberList = splitFields[1];
    var chapterNumberList = splitFields[2];
    var group1List = splitFields[3];
    var fileList = splitFields[4];

    var uploadFormData = new FormData(uploadForm); //create old form data to steal group and language inputs
    splitFormData = new FormData(); //create new form data
    splitFormData.append("manga_id", mangaIdField.value);
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
    if(group1List.length == 1) //single group upload
    {
        splitFormData.append("group_id", group1List[0]);
    }
    else //multi group upload
    {
        splitFormData.append("group_id", group1List[i]);
    }
    splitFormData.append("lang_id", uploadFormData.get("lang_id"));
    splitFormData.append("file", fileList[i]);

    //fill in bottom form so uploader can see what's being uploaded
    if(chapterNameList.length == 1)
    {
        chapterNameField.value = chapterNameList[0];
    }
    else
    {
        chapterNameField.value = chapterNameList[i];
    }
    if(volumeNumberList.length == 1)
    {
        volumeNumberField.value = volumeNumberList[0];
    }
    else
    {
        volumeNumberField.value = volumeNumberList[i];
    }
    if(chapterNumberList.length == 1)
    {
        chapterNumberField.value = parseInt(chapterNumberList[0]) + i;
    }
    else
    {
        chapterNumberField.value = chapterNumberList[i];
    }
    if(group1List.length == 1)
    {
        document.getElementById("group_id").previousSibling.previousSibling.childNodes[0].childNodes[1].data = " id: " + group1List[0];
    }
    else
    {
        document.getElementById("group_id").previousSibling.previousSibling.childNodes[0].childNodes[1].data = " id: " + group1List[i];
    }
    fileText.value = fileList[i].name;

    var j = i+1; //for printing purposes only
    var success_msg = "<div class='alert alert-success text-center' role='alert'><strong>Success:</strong> " + j + "/" + fileList.length + " chapters have been uploaded.</div>";
    var error_msg = "<div class='alert alert-warning text-center' role='alert'><strong>Warning:</strong> Something went wrong with your upload at " + j + "/" + fileList.length + " files. All previous files have been uploaded.</div>";
 
    $("#upload_button").html("<span class='fas fa-spinner fa-pulse' aria-hidden='true' title=''></span> Uploading...").attr("disabled", true);
    $("#mass_upload_button").html("<span class='fas fa-spinner fa-pulse' aria-hidden='true' title=''></span> Mass Uploading: " + j + "/" + fileList.length).attr("disabled", true);

    event.preventDefault();
    $.ajax({
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
                $("#mass_upload_button").html("<span class='fas fa-upload fa-fw' aria-hidden='true' title=''></span> Upload").attr("disabled", false);
                uploadForm.reset();
                massUploadForm.reset();
            }
        },
 
        error: function(err) {
            console.error(err);
            $('#progressbar').parent().hide();
            $("#upload_button").html("<span class='fas fa-upload fa-fw' aria-hidden='true' title=''></span> Upload").attr("disabled", false);
            $("#mass_upload_button").html("<span class='fas fa-upload fa-fw' aria-hidden='true' title=''></span> Upload").attr("disabled", false);
            $("#message_container").html(error_msg).show().delay(3000).fadeOut();
        }
    });
}

createForm();