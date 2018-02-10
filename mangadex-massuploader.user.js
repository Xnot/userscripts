// ==UserScript==
// @name         Mangadex (shitty) Mass Uloader
// @namespace    https://github.com/LucasPratas/userscripts
// @version      1.3
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
	"use strict";

    var myUserscriptInfo = document.createElement("div");
    myUserscriptInfo.setAttribute("class", "alert alert-info");
    myUserscriptInfo.setAttribute("role", "alert");
    myUserscriptInfo.innerHTML = "<h4>You are using Shitty Mass Upload Userscript For Mangadex™ by Xnot</h4>"
    + "<ol><li>Insert chapter names,volume numbers, and chapter numbers separated by <strike>comas</strike> a dash followed by a coma (-,) into their respective fields"
    + "<br />Protip: use TEXTJOIN(CONCAT(UNICHAR(45),UNICHAR(44)),0 ,ROWSHERE) on excel"
    + "<br /><strike>If there's a chapter name that actually has a comma in it, then you're shit outta luck</strike>"
    + "<br />I sure hope there aren't as many chapter names with \"-,\" in them as ones with comas</li>"
    + "<li>Click browse and use shift/ctrl so select all files</li>"
    + "<li>Select group and language from the standard upload form below the mass upload form</li>"
    + "Hopefully I can care enough to figure these out properly soon"
    + "<li>Click the Mass Upload button</li>"
    + "<li>If you realized you've fucked up halfway through, just close the tab or something, cause I have no idea how to make a cancel button and Holo didn't make one for me to rip off</li></ol>";
    var container = document.getElementById("content");
    container.insertBefore(myUserscriptInfo, container.childNodes[5]);


    var uploadForm = document.getElementById("upload_form"); //get real upload form
    var massUploadForm = uploadForm.cloneNode(true); //create mass upload form as clone of upload form
    //uploadForm.style = "margin-top: 15px; display: none"; //hide upload form 
    massUploadForm.id = "mass_upload_form";

    var mangaNameGroup = massUploadForm.childNodes[1];
    var chapterNameGroup = massUploadForm.childNodes[3];
    var volumeNumberGroup = massUploadForm.childNodes[5];
    var chapterNumberGroup = massUploadForm.childNodes[7];
    var group1Group = massUploadForm.childNodes[9];
    var group2Group = massUploadForm.childNodes[11];
    var languageGroup = massUploadForm.childNodes[13];
    var fileGroup = massUploadForm.childNodes[15];
    var buttonsGroup = massUploadForm.childNodes[17];

	//modify chapter name field
    var chapterNameLabel = chapterNameGroup.childNodes[1];
    chapterNameLabel.setAttribute("for", "chapter_names");
    chapterNameLabel.innerHTML = "Chapter Names";
    var chapterNameField = chapterNameGroup.childNodes[3].childNodes[1];
    chapterNameField.setAttribute("id", "chapter_names");
    chapterNameField.setAttribute("name", "chapter_names");
    chapterNameField.setAttribute("placeholder", "nameForCh1, nameForCh2, nameForCh3");

	//modify volume field
	var volumeNumberLabel = volumeNumberGroup.childNodes[1];
    volumeNumberLabel.setAttribute("for", "volume_numbers");
    volumeNumberLabel.innerHTML = "Volume Numbers";
    var volumeNumberField = volumeNumberGroup.childNodes[3].childNodes[1];
    volumeNumberField.setAttribute("id", "volume_numbers");
    volumeNumberField.setAttribute("name", "volume_numbers");
    volumeNumberField.setAttribute("placeholder", "volumeForCh1, volumeForCh2, volumeForCh3");

    //modify chapter number field
	var chapterNumberLabel = chapterNumberGroup.childNodes[1];
    chapterNumberLabel.setAttribute("for", "chapter_numbers");
    chapterNumberLabel.innerHTML = "Chapter Numbers";
    var chapterNumberField = chapterNumberGroup.childNodes[3].childNodes[1];
    chapterNumberField.setAttribute("id", "chapter_numbers");
    chapterNumberField.setAttribute("name", "chapter_numbers");
    chapterNumberField.setAttribute("placeholder", "ch1, ch2, ch3");

    //modify the group 1 field
    group1Group.replaceWith(chapterNumberGroup.cloneNode(true)); //clone a non-dropdown because fuck that
    group1Group = massUploadForm.childNodes[9]; //why doesn't replace funcion update the pointer
    var group1Label = group1Group.childNodes[1];
    group1Label.setAttribute("for", "groups_id");
    group1Label.innerHTML = "Groups 1";
    var group1Field = group1Group.childNodes[3].childNodes[1];
    group1Field.setAttribute("id", "groups_id");
    group1Field.setAttribute("name", "groups_id");
    group1Field.setAttribute("disabled", "");
    group1Field.setAttribute("placeholder", "not implemented because it's a pain in the ass, fill in the group in the bottom form instead");

    //modify the group 2 field
    group2Group.replaceWith(chapterNumberGroup.cloneNode(true)); //clone a non-dropdown because fuck that
    group2Group = massUploadForm.childNodes[11]; //why doesn't replace funcion update the pointer
    var group2Label = group2Group.childNodes[1];
    group2Label.setAttribute("for", "groups_id_2");
    group2Label.innerHTML = "Groups 2";
    var group2Field = group2Group.childNodes[3].childNodes[1];
    group2Field.setAttribute("id", "groups_id_2");
    group2Field.setAttribute("name", "groups_id_2");
    group2Field.setAttribute("disabled", "");
    group2Field.setAttribute("placeholder", "not implemented (by Holo, not my fault)");

 	//modify the language field
    languageGroup.replaceWith(chapterNumberGroup.cloneNode(true)); //clone a non-dropdown because fuck that
    languageGroup = massUploadForm.childNodes[13]; //why doesn't replace funcion update the pointer
    var languageLabel = languageGroup.childNodes[1];
    languageLabel.setAttribute("for", "langs_id");
    languageLabel.innerHTML = "Languages";
    var languageField = languageGroup.childNodes[3].childNodes[1];
    languageField.setAttribute("id", "langs_id");
    languageField.setAttribute("name", "langs_id");
    languageField.setAttribute("disabled", "");
    languageField.setAttribute("placeholder", "not implemented because it's a pain in the ass and who the fuck mass uploads multiple languages, fill in the language in the bottom form instead");

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

    //modify buttons
    buttonsGroup.removeChild(buttonsGroup.childNodes[1]); //delete redundant back button
    var uploadButtonContainer = buttonsGroup.childNodes[2];
    uploadButtonContainer.setAttribute("class", "col-sm-12 text-right");
	var uploadButton = uploadButtonContainer.childNodes[1];
	uploadButton.setAttribute("type", "button");
	uploadButton.setAttribute("class", "btn btn-danger");
	uploadButton.setAttribute("id", "mass_upload_button");
	uploadButton.childNodes[2].innerHTML = "Mass Upload";
	uploadButton.addEventListener("click", function(event){
                                                        massUpload(event, [chapterNameField, volumeNumberField, chapterNumberField, fileField]); //group1Field, 
                                                     });


    document.getElementsByClassName("panel-body")[1].insertBefore(massUploadForm, uploadForm); //insert mass upload form
}

function massUpload(event, fields)
{
    var splitFields = splitInputs(fields);
    if(splitFields[3].length != splitFields[0].length || splitFields[3].length != splitFields[1].length || splitFields[3].length != splitFields[2].length)
    {
        $("#message_container").html("<div class='alert alert-warning text-center' role='alert'><strong>Warning:</strong> The amount of files does not match names, volumes, or chatpers. All files will be uploaded but some may have empty fields</div>.").show().delay(3000).fadeOut();
    }
    uploadNext(event, splitFields, 0);
}

function splitInputs(fields) // splits the coma separated fields into arrays
{
    var chapterNameList = fields[0].value.split("-,");
    var volumeNumberList = fields[1].value.split("-,");
    var chapterNumberList = fields[2].value.split("-,");
    var fileList = fields[3].files;
    //var group1List = fields[3].value.split(",");
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
    // for(let i = 0; i < group1List.length; i++)
    // {
    //     group1List[i] = group1List[i].trim();
    // }

    return [chapterNameList, volumeNumberList, chapterNumberList, fileList];
}

function uploadNext(event, splitFields, i) //definitely not copypasted from holo's upload code
{
    var uploadForm = document.getElementById("upload_form"); //real upload form

    var mangaIdField = uploadForm.childNodes[1].childNodes[3].childNodes[3];
    var chapterNameField = uploadForm.childNodes[3].childNodes[3].childNodes[1];
    var volumeNumberField = uploadForm.childNodes[5].childNodes[3].childNodes[1];
    var chapterNumberField = uploadForm.childNodes[7].childNodes[3].childNodes[1];
    //var group1Field = uploadForm.childNodes[9].childNodes[3].childNodes[1];
    //var languageGroup = uploadForm.childNodes[13];
    var fileField = uploadForm.childNodes[15].childNodes[3].childNodes[1].childNodes[3].childNodes[1].childNodes[5];
    var uploadButton = uploadForm.childNodes[17].childNodes[3].childNodes[1];

    var chapterNameList = splitFields[0];
    var volumeNumberList = splitFields[1];
    var chapterNumberList = splitFields[2];
    //var group1List = splitFields[3];
    var fileList = splitFields[3];

    var uploadFormData = new FormData(uploadForm); //create old form data to steal group and language inputs
    splitFormData = new FormData(); //create new form data
    splitFormData.append("manga_id", mangaIdField.value);
    splitFormData.append("chapter_name", chapterNameList[i]); //append split mass inputs
    splitFormData.append("volume_number", volumeNumberList[i]);
    splitFormData.append("chapter_number", chapterNumberList[i]);
    splitFormData.append("group_id", uploadFormData.get("group_id")); //steal inputs from old form
    splitFormData.append("lang_id", uploadFormData.get("lang_id"));
    splitFormData.append("file", fileList[i]);

    chapterNameField.value = chapterNameList[i]; //fill in bottom form so uploader can see what's being uploaded
    volumeNumberField.value = volumeNumberList[i];
    chapterNumberField.value = chapterNumberList[i];

    var j = i+1; //for printing purposes only
    var success_msg = "<div class='alert alert-success text-center' role='alert'><strong>Success:</strong> " + j + "/" + fileList.length + "chapters have been uploaded.</div>";
    var error_msg = "<div class='alert alert-warning text-center' role='alert'><strong>Warning:</strong> Something went wrong with your upload at " + j + "/" + fileList.length + "files. All previous files have been uploaded.</div>";
 
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
            $("#upload_button").html("<span class='fas fa-upload fa-fw' aria-hidden='true' title=''></span> Upload").attr("disabled", false);
            $("#mass_upload_button").html("<span class='fas fa-upload fa-fw' aria-hidden='true' title=''></span> Upload").attr("disabled", false);
            i = i + 1;
                if(i < fileList.length)
                {
                    setTimeout(function() { uploadNext(event, splitFields, i); }, 500);
                }
        },
 
        error: function(err) {
            console.error(err);
            $('#progressbar').parent().hide();
            $("#upload_button").html("<span class='fas fa-upload fa-fw' aria-hidden='true' title=''></span> Upload").attr("disabled", false);
            $("#message_container").html(error_msg).show().delay(3000).fadeOut();
        }
    });
}

createForm();