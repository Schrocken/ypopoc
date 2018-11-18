var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request-promise');

var PORT = 2999;
var app = express();

// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

//------------------Get Current Date---------------------
var today = new Date();
var currentDate = (today.getDate() + "/" + today.getMonth() + "/" + today.getFullYear());

//----------------- New MemberId generation------------------
function funcMemberId() {
    var fileName = fs.readFileSync('./textfile.json', 'utf8');
    var content = JSON.parse(fileName);
    content.memberId = content.memberId + 1;
    fs.writeFileSync('./textfile.json', JSON.stringify(content), 'utf8');
    var fileName = fs.readFileSync('./textfile.json', 'utf8');
    var content = JSON.parse(fileName);
    return (content.memberId);
}

//----------------- New ContactId generation------------------
function funcContactId() {
    var fileName = fs.readFileSync('./textfile.json', 'utf8');
    var content = JSON.parse(fileName);
    content.contactId = content.contactId + 1;
    fs.writeFileSync('./textfile.json', JSON.stringify(content), 'utf8');
    var fileName = fs.readFileSync('./textfile.json', 'utf8');
    var content = JSON.parse(fileName);
    return (content.contactId);
}

//----------------- New MeetingId generation------------------
function funcMeetingId() {
    var fileName = fs.readFileSync('./textfile.json', 'utf8');
    var content = JSON.parse(fileName);
    content.meetingId = content.meetingId + 1;
    fs.writeFileSync('./textfile.json', JSON.stringify(content), 'utf8');
    var fileName = fs.readFileSync('./textfile.json', 'utf8');
    var content = JSON.parse(fileName);
    return (content.meetingId);
}

//----------------- New TaskId generation------------------
function funcTaskId() {
    var fileName = fs.readFileSync('./textfile.json', 'utf8');
    var content = JSON.parse(fileName);
    content.taskId = content.taskId + 1;
    fs.writeFileSync('./textfile.json', JSON.stringify(content), 'utf8');
    var fileName = fs.readFileSync('./textfile.json', 'utf8');
    var content = JSON.parse(fileName);
    return (content.taskId);
}

//1----------------Accept Contact Request-----------------
app.post('/memberRequest/:memberId', urlencodedParser, function (req, res) {
    var memberId = req.params.memberId;
    request({
        "method": "GET",
        "uri": "http://35.220.224.69:3000/readMember/" + memberId,
        "json": true
    })
        .then(function (result) {

            var jsonData = JSON.parse(result['result']);
            var Details = {
                memberName: jsonData.membername,
                memberShortBio: jsonData.membershortbio,
                membershipDate: jsonData.membershipdate,
                aboutMember: jsonData.memberabout,
                memberLoc: jsonData.memberlocation,
                memberContactNum: jsonData.memberphonenumber,
                memberEmail: jsonData.memberemail,
                memberSocialAcc: jsonData.membersocialaccount,
                setMeetings: jsonData.sharingdefaultsetmeetings,
                defaultMemDateFlag: jsonData.sharingdefaultmemdate,
                defaultEmailFlag: jsonData.sharingdefaultemail,
                defaultPhoneFlag: jsonData.sharingdefaultphone,
                defaultSocialFlag: jsonData.sharingdefaultsocialacc,
                defaultLocationFlag: jsonData.sharingdefaultlocation
            }
            res.json(Details);
        })

});

//2----------------Deny Contact Request---------------------------------
app.get('/denyRequest/:taskId', function (req, res) {
    var taskId = req.params.taskId;
    request({
        "method": "GET",
        "uri": "http://35.220.224.69:3000/readTask/" + taskId,
        "json": true
    }).then(function (result) {
        var jsonData = JSON.parse(result['result']);

        var receivingMemberId = jsonData.receivingmemberid;
        var requestingMemberId = jsonData.requestingmemberid;
        var taskType = jsonData.tasktype;
        var taskCreationDate = jsonData.taskcreationdate;
        var taskUpdateDate = currentDate;
        var taskStatus = "closed";
        var taskCloseDate = currentDate;
        var taskClosedBy = jsonData.receivingmemberid;
        var proposedMeetingDate = "nil";
        var proposedMeetingTime = "nil";
        var proposedMeetingReason = "nil";
        var requestAccepted = "no";
        var isDeleted = "no";

        request({
            "method": "POST",
            "uri": "http://35.220.224.69:3000/writeTask",
            "json": true,
            "body": {
                "Args": [taskId, requestingMemberId, receivingMemberId, taskType, taskCreationDate, taskUpdateDate, taskStatus, taskCloseDate, taskClosedBy, proposedMeetingDate, proposedMeetingTime, proposedMeetingReason, requestAccepted, isDeleted, "14"]
            }
        }).then(function (result) { res.send(result) })
    })
});

//3----------------------User shares details with new contact--------------------
app.post('/setShareDetails/:taskId', urlencodedParser, function (req, res) {

    var receivingMemberId, requestingMemberId, taskId, contactEstablishedDate, contactStatus, contactDeletedDate, contactDeletedBy;
    var memberLocation2, memberEmail2, memberContactNum2, memberSocialAcc2, setMeetings2, aboutMember2;
    var taskId = req.params.taskId;
    var memberLocation1 = req.body.memberLoc;
    var memberContactNum1 = req.body.memberContactNum1;
    var memberEmail1 = req.body.memberEmail1;
    var memberSocialAcc1 = req.body.memberSocialAcc1;
    var setMeetings1 = req.body.setMeetings1;
    var aboutMember1 = req.body.aboutMember1;

    console.log("Phone Input for Set Share", memberLocation1, memberContactNum1, memberEmail1, memberSocialAcc1, setMeetings1, aboutMember1)

    // //Generate a new contactID1
    var newContactId1 = funcContactId();
    console.log("cid1 = ",newContactId1);


    //Generate a new contactID2
    var newContactId2 = funcContactId();
    console.log("cid2 = " + newContactId2);

    //Call Tasks table to get receiving memeberid and requesting memberId
    console.log("TaskID = " + taskId);
    request({
        "method": "GET",
        "uri": "http://35.220.224.69:3000/readTask/" + taskId,
        "json": true
    })
        .then(function (result) {

            var jsonData = JSON.parse(result['result']);
            receivingMemberId = jsonData.receivingmemberid;
            requestingMemberId = jsonData.requestingmemberid;
            console.log("Task Output = ", receivingMemberId, requestingMemberId);
        })

        .then(function () {

            contactEstablishedDate = currentDate;
            contactStatus = "Active";
            contactDeletedDate = "nil";
            contactDeletedBy = "nil";
            //Write a new contact 1: Id:recieving id (the person who accepted the contact)
	            console.log("Before writeContact for Receiving Member: ",newContactId1, requestingMemberId, receivingMemberId, taskId, contactEstablishedDate, memberLocation1, memberContactNum1, memberEmail1, memberSocialAcc1, setMeetings1, aboutMember1, contactStatus, contactDeletedDate, contactDeletedBy)

            request({
                "method": "POST",
                "uri": "http://35.220.224.69:3000/writeContact",
                "json": true,
                "body": {
                    "Args": [newContactId1, requestingMemberId, receivingMemberId, taskId, contactEstablishedDate, memberLocation1, memberContactNum1, memberEmail1, memberSocialAcc1, setMeetings1, aboutMember1, contactStatus, contactDeletedDate, contactDeletedBy, "N"]
                }
            }).then(function (result) {
            })
        })

        .then(function () {
            //-----------------invoke members table----------------
            request({
                "method": "GET",
                "uri": "http://35.220.224.69:3000/readMember/" + requestingMemberId,
                "json": true
            })
                .then(function (result) {
                    console.log("Requesting Member Details" + result);
                    var jsonData = JSON.parse(result['result']);
                    memberLocation2 = jsonData.sharingdefaultlocation;
                    memberContactNum2 = jsonData.sharingdefaultphone;
                    memberEmail2 = jsonData.sharingdefaultemail;
                    memberSocialAcc2 = jsonData.sharingdefaultsocialacc;
                    setMeetings2 = jsonData.sharingdefaultsetmeetings;
                    aboutMember2 = "y";
                    //Write a new contact 2: Id:requestingMemberId (the person who sent the contact request) 
                    console.log("Before writeContact for Requesting Member: ",memberLocation2, memberEmail2, memberContactNum2, memberSocialAcc2, setMeetings2, aboutMember2);

		request({
                        "method": "POST",
                        "uri": "http://35.220.224.69:3000/writeContact",
                        "json": true,
                        "body": {
                            "Args": [newContactId2, receivingMemberId, requestingMemberId, taskId, contactEstablishedDate, memberLocation2, memberEmail2, memberContactNum2, memberSocialAcc2, setMeetings2, aboutMember2, contactStatus, contactDeletedDate, contactDeletedBy, "N"]
                        }
                    }).then(function (result) {
                    });
                })
        })
        .then(function () {
            //Call task status and now keep task status closed.
            var taskCreationDate = currentDate;
            console.log("the current date is" + taskCreationDate);
            var taskUpdateDate = "nil";
            var taskStatus = "closed";
            var taskType = "contact";
            var taskCloseDate = currentDate;
            var taskClosedBy = receivingMemberId;
            var proposedMeetingDate = "nil";
            var proposedMeetingReason = "nil";
            var proposedMeetingTime = "nil";
            var requestAccepted = "y";
            var isDeleted = "n";

            request({
                "method": "POST",
                "uri": "http://35.220.224.69:3000/writeTask",
                "json": true,
                "body": {
                    "Args": [taskId, requestingMemberId, receivingMemberId, taskType, taskCreationDate, taskUpdateDate, taskStatus, taskCloseDate, taskClosedBy, proposedMeetingDate, proposedMeetingTime, proposedMeetingReason, requestAccepted, isDeleted]
                }
            })
                .then(function (result) {
                    console.log("updated the task as closed");
                    res.end('ok');
                })

        })

});

//4-----------------------Delete Contact------------------------------------
//id1500
app.post('/deleteContact/:contactId', function (req, res) {

    var requestingMemberId, contactMemberId, originatingTaskId, contactEstablishedDate, locationShared, emailShared, phoneShared, socialAccountShared, setMeetings, aboutShared, contactStatus, contactDeletedDate, contactDeletedBy, isDeleted;
    //call contacts table
    var contactId = req.params.contactId;
    request({
        "method": "GET",
        "uri": "http://35.220.224.69:3000/readContact/" + contactId,
        "json": true
    }).then(function (result) {
        var jsonData = JSON.parse(result['result']);
        console.log(jsonData);


        requestingMemberId = jsonData.requestingmemberid;
        contactMemberId = jsonData.contactmemberid;
        originatingTaskId = jsonData.originatingtaskid;
        contactEstablishedDate = jsonData.contactestablisheddate;
        locationShared = jsonData.locationshared;
        emailShared = jsonData.emailShared;
        phoneShared = jsonData.phoneshared;
        socialAccountShared = jsonData.socialaccountshared;
        setMeetings = jsonData.setMeetings;
        aboutShared = jsonData.aboutshared;
        contactStatus = "deleted";
        contactDeletedDate = currentDate;
        contactDeletedBy = contactId;
        isDeleted = "yes";

        request({
            "method": "POST",
            "uri": "http://35.220.224.69:3000/writeContact",
            "json": true,
            "body": {
                "Args": [contactId, requestingMemberId, contactMemberId, originatingTaskId, contactEstablishedDate, locationShared, emailShared, phoneShared, socialAccountShared, setMeetings, aboutShared, contactStatus, contactDeletedDate, contactDeletedBy, isDeleted]
            }
        }).then(function (result) {
            console.log(result);
        })
            .then(function () {
                request({
                    "method": "GET",
                    "uri": "http://35.220.224.69:3000/queryContactsByContactMemberID/" + requestingMemberId,
                    "json": true
                }).then(function (result) {
                    var i;
                    
                   var JSONData2= JSON.parse(result['result']);
                    console.log(JSONData2);
                    var count = Object.keys(JSONData2).length;
                    for(i=0; i<count; i++)
                    {
                        console.log(i);
                        console.log(originatingTaskId)
                        if((JSONData2[i].Record.originatingtaskid)== originatingTaskId){
                            console.log (JSONData2[i].Record.contactid);
                            var contactID2=(JSONData2[i].Record.contactid);
                            request({
                                "method": "POST",
                                "uri": "http://35.220.224.69:3000/writeContact",
                                "json": true,
                                "body": {
                                    "Args": [contactID2, contactMemberId, requestingMemberId, originatingTaskId, contactEstablishedDate, locationShared, emailShared, phoneShared, socialAccountShared, setMeetings, aboutShared, contactStatus, contactDeletedDate, contactDeletedBy, isDeleted]
                                }
                            }).then(function (result) {
                                console.log(result);
                                res.send(result);
                            })

                        }
                    }
               
                })

            })
    })
});


//5---------------------Retrive contact details (shared details)---------------
app.get('/getContactDetails/:contactId', function (req, res) {
    var contactId = req.params.contactId;

    request({
        "method": "GET",
        "uri": "http://35.220.224.69:3000/readContact/" + contactId,
        "json": true
    }).then(function (result) {
        var jsonData = JSON.parse(result['result']);
        console.log(result);

        contactMemberId = jsonData.contactmemberid;
        requestingMemberId = jsonData.requestingmemberid;
        locationShared = jsonData.locationshared;
        emailShared = jsonData.emailshared;
        phoneShared = jsonData.phoneshared;
        socialAccountShared = jsonData.socialaccountshared;
        setMeetings = jsonData.setmeetingflag;
        aboutShared = jsonData.aboutshared;

        var arraySharedDetails = [];


        if (locationShared == ("y" || "yes" || "1")) {
            arraySharedDetails.push("memberLocation");
        }
        if (emailShared == ("y" || "yes" || "1")) {
            arraySharedDetails.push("memberEmail");
        }
        if (phoneShared === ("y" || "yes" || "1")) {
            arraySharedDetails.push("memberPhoneumber");
        }
        if (socialAccountShared === ("y" || "yes" || "1")) {
            arraySharedDetails.push("memberSocialAccount");
        }
        if (setMeetings === ("y" || "yes" || "1")) {
            arraySharedDetails.push("setmeetingflag");
        }
        if (aboutShared === ("y" || "yes" || "1")) {
            arraySharedDetails.push("memberAbout");
        }
        console.log("array shared details orig val--" + arraySharedDetails);

        //call members table and send only those values which have been allowed to share by the member

        request({
            "method": "GET",
            "uri": "http://35.220.224.69:3000/readMember/" + requestingMemberId,
            "json": true
        }).then(function (result) {
            var jsonMemData = JSON.parse(result['result']);
            var searchField;
            var jsonval = {};

            for (i = 0; i < (arraySharedDetails.length); i++) {
                searchField = arraySharedDetails[i];
                jsonval[(arraySharedDetails[i])] = (jsonMemData[searchField]);
                console.log(jsonMemData[searchField]);
            }
            console.log(jsonval);
            res.json(jsonval);
        })
    })
});

//6--------------------Request New contact----------------------------------
//id901
app.post('/addNewMember/:userId', urlencodedParser, function (req, res) {
    var userId = req.params.userId;
    var newTaskId = funcTaskId();
    console.log("New TaskId " + newTaskId);
    var requestingMemberId = userId;
    var receivingMemberId = req.body.memberId;
    var taskType = "contact";
    var taskCreationDate = currentDate;
    var taskUpdateDate = "nil";
    var taskStatus = "open";
    var taskCloseDate = "nil";
    var taskClosedBy = "nil";
    var proposedMeetingDate = "nil";
    var proposedMeetingTime = "nil";
    var proposedMeetingReason = "nil";
    var requestAccepted = "nil";
    var isDeleted = "n";

    request({
        "method": "POST",
        "uri": "http://35.220.224.69:3000/writeTask",
        "json": true,
        "body": {
            "Args": [newTaskId, requestingMemberId, receivingMemberId, taskType, taskCreationDate, taskUpdateDate, taskStatus, taskCloseDate, taskClosedBy, proposedMeetingDate, proposedMeetingTime, proposedMeetingReason, requestAccepted, isDeleted]
        }
    }).then(function (result) {
        console.log(result);
        var Finalresult = { "taskId": newTaskId }
        res.send(Finalresult);

    })
});

//7---------------------Request New Meeting ---------------------------------
app.post('/addNewMeeting/:userId', urlencodedParser, function (req, res) {
    var userId = req.params.userId;
    var newTaskId = funcTaskId();
    console.log("New TaskId " + newTaskId);
    var requestingMemberId = userId;
    var receivingMemberId = req.body.memberId;
    var taskType = "meeting";
    var taskCreationDate = currentDate;
    var taskUpdateDate = "nil";
    var taskStatus = 'open';
    var taskCloseDate = "nil";
    var taskClosedBy = "nil";
    var proposedMeetingDate = req.body.meetingDate;
    var proposedMeetingTime = req.body.meetingTime;
    var proposedMeetingReason = req.body.meetingReason;
    var requestAccepted = "nil";
    var isDeleted = "n";

    request({
        "method": "POST",
        "uri": "http://35.220.224.69:3000/writeTask",
        "json": true,
        "body": {
            "Args": [newTaskId, requestingMemberId, receivingMemberId, taskType, taskCreationDate, taskUpdateDate, taskStatus, taskCloseDate, taskClosedBy, proposedMeetingDate, proposedMeetingTime, proposedMeetingReason, requestAccepted, isDeleted]
        }
    }).then(function (result) {
        console.log(result);
        var Finalresult = { "taskId": newTaskId }
        res.send(Finalresult);

    })
});

//8-----------------------------Remove Meetings-----------------------------------------
app.post('/removeMeetings/:meetingId', function (req, res) {
    var meetingId = req.params.meetingId;

    //call meetings table and update meetings table
    request({
        "method": "GET",
        "uri": "http://35.220.224.69:3000/readMeeting/" + meetingId,
        "json": true
    }).then(function (result) {
        var jsonData = JSON.parse(result['result']);
        var originatingTaskId = jsonData.originatingtaskid;
        var requestingMemberId = jsonData.requestingmemberid;
        var contactMemberId = jsonData.contactmemberid;
        var meetingDate = jsonData.meetingdate;
        var meetingDurationMinutes = jsonData.meetingurationminutes;
        var meetingReason = jsonData.meetingreason;
        var showMeetingFlag = "n";
        var isDeleted = "y";
        request({
            "method": "POST",
            "uri": "http://35.220.224.69:3000/writeMeeting",
            "json": true,
            "body": {
                "Args": [meetingId, requestingMemberId, contactMemberId, originatingTaskId, meetingDate, meetingDurationMinutes, meetingReason, showMeetingFlag, isDeleted]
            }
        })
            .then(function (result) {
                console.log(result);
                res.send(200);
            })
    })
});


//9---------------------------Get Default sharing data------------------------------------
//id900
app.get('/getDefaultSharingRule/:userId', function (req, res) {
    var userId = req.params.userId;
    request({
        "method": "GET",
        "uri": "http://35.220.224.69:3000/readMember/" + userId,
        "json": true
    }).then(function (result) {
        var jsonData = JSON.parse(result['result']);
        var shareDetails = {
            sMemberLoc: jsonData.sharingdefaultlocation,
            sMemberContactNum: jsonData.sharingdefaultphone,
            sMemberEmail: jsonData.sharingdefaultemail,
            sMemberSocialAcc: jsonData.sharingdefaultsocialacc,
            sSetMeetings: jsonData.sharingdefaultsetmeetings,
        }
        res.json(shareDetails);
    })

});

//10----------------------------Get TaskList----------------------------------------------
function addPromises(memberRecord) {

    var id = memberRecord.requestingmemberid;
    return new Promise((resolve, reject) => {
        var options = { url: "http://35.220.224.69:3000/readMember/" + id };
        request.get(options, function (err, res, body) {

            var responseData = JSON.parse((JSON.parse(body)).result);
            var displayData = {};

            displayData.taskId = memberRecord.taskid;
            displayData.taskType = memberRecord.tasktype;
            displayData.memberName = responseData.membername;
            displayData.memberShortBio = responseData.membershortbio;
            displayData.memberAbout = responseData.memberabout;
            displayData.memberDetails = responseData.membershipdate;

            resolve(displayData);
        });
    });
}

app.get('/getTaskList/:userId', function (req, res) {

    console.log("------------------------------gettask list api--------------------");


    var userId = req.params.userId;
    request({
        "method": "GET",
        "uri": "http://35.220.224.69:3000/queryTasksByReceivingMemberID/" + userId,
        "json": true,
        "async": false

    }).then(function (result) {
        var jsonData = JSON.parse(result['result']);
        console.log(jsonData);
        var count = Object.keys(jsonData).length;
        console.log("count " + count);
        var opendata = [];
        var noactiverequests = [];
        var j;

        try {
            var promises = [];
            for (i = 0; i < count; i++) {
                var memberRecord = jsonData[i].Record;
                noactiverequests.push(memberRecord.taskstatus);
               // for (j = 0; j < (noactiverequests.length); j++) {
                 //   if ((memberRecord.taskstatus != 'open') && (memberRecord.taskstatus == 'closed')) {
                   //     count2 = 0;
                   // }
               // }
                if (memberRecord.taskstatus == 'open') {
                    opendata.push((memberRecord.taskstatus));
                    console.log(opendata)
                    var count2 = opendata.length;
                    var promise = addPromises(memberRecord);
                    promises.push(promise);
                }

            }

            Promise.all(promises).then(function (result) {
                console.log(result);
                res.json({ 'NoofActiveRequests': count2, 'taskList': result });
            });
        }
        catch (ex) {
            console.log(ex);
        }
    });

});


//11---------------------------------Get contact List----------------------------
function addPromise(memberRecord) {

    var id = memberRecord.contactmemberid;
    return new Promise((resolve, reject) => {
        var options = { url: "http://35.220.224.69:3000/readMember/" + id };
        request.get(options, function (err, res, body) {
            var responseData = JSON.parse((JSON.parse(body)).result);
            var displayData = {};

            displayData.memberId = id;
            displayData.memberName = responseData.membername;

            displayData.contactId = memberRecord.contactid;

            if (memberRecord.aboutshared == 'y') {
                displayData.memberAbout = responseData.memberabout;
            }
            if (memberRecord.locationshared == 'y') {
                displayData.memberLocation = responseData.memberlocation;
            }
            if (memberRecord.emailshared == 'y') {
                displayData.memberEmail = responseData.memberemail;
            }
            if (memberRecord.phoneshared == 'y') {
                displayData.memberPhonenumber = responseData.memberphonenumber;
            }
            if (memberRecord.socialaccountshared == 'y') {
                displayData.membersocialaccount = responseData.membersocialaccount;
            }
            if (memberRecord.setmeetingflag == 'y') {
                displayData.setmeetingflag = responseData.sharingdefaultsetmeetings;
            }

            displayData.membershipDate = responseData.membershipdate;


            resolve(displayData);
        });
    });
}

app.get('/getContactList/:userId', function (req, res) {

    console.log("------------------------------getcontact list api--------------------");

    var userId = req.params.userId;
    request({
        "method": "GET",
        "uri": "http://35.220.224.69:3000/queryContactsByRequestingMemberID/" + userId,
        "json": true,
        "async": false

    }).then(function (result) {
        var jsonData = JSON.parse(result['result']);
        console.log("queryContactsbycontactmemid result is here---")
        console.log(jsonData)
        var count = Object.keys(jsonData).length;
        var noOfContacts = [];
        var noOfContactsactive = [];
        var j;
        try {
            var promises = [];
            for (i = 0; i < count; i++) {
                var memberRecord = jsonData[i].Record;

                if (memberRecord.contactstatus == 'active') {
                    noOfContactsactive.push(memberRecord.contactstatus);
                    var count2 = (noOfContactsactive.length);
                    var promise = addPromise(memberRecord);
                    promises.push(promise);
                }

            }

            Promise.all(promises).then(function (result) {
                console.log("final result of contactList is here---")
                console.log(result);
                res.json({ 'contactsCount': count2, 'contactList': result });
            });
        }
        catch (ex) {
            console.log(ex);
        }
    });

});

//12-----------------------------Get all the open meetings-------------------------------
app.get('/getOpenMeetings/:userId', function (req, res) {
    var userId = req.params.userId;


    request({
        "method": "GET",
        "uri": "http://35.220.224.69:3000/queryMeetingsByContactMemberID/" + userId,
        "json": true,

    }).then(function (result) {
        var jsonData = JSON.parse(result['result']);
        var count = Object.keys(jsonData).length;
        var jsonValue = {};
        var i;
        console.log(count);
        var jsonDataArray = [];

        for (i = 0; i < count; i++) {
            if ((jsonData[i].Record.showmeetingflag) == 'y') {

                jsonValue["MeetingId"] = (jsonData[i].Record.meetingid);
                jsonValue["reasonForMeeting"] = (jsonData[i].Record.MeetingReason);
                jsonValue["dateOfMeeting"] = (jsonData[i].Record.meetingdate);
                jsonValue["timeOfMeeting"] = (jsonData[i].Record.meetingurationminutes);
                jsonValue["memberId"] = (jsonData[i].Record.contactmemberid);
                jsonDataArray.push(jsonValue);
                jsonValue = {};
            }
        }
        res.send(jsonDataArray);
    })
});

//13----------------------User accepts new meeting request--------------------

app.post('/acceptMeetingRequest/:taskId', urlencodedParser, function (req, res) {

    var receivingMemberId, requestingMemberId, taskId;
    var meetingDate, meetingReason, meetingDurationMinutes;
    var taskId = req.params.taskId;


    // //Generate a new meetingID1
    var newMeetingId1 = funcMeetingId();
    console.log(newMeetingId1);


    //Generate a new meetingID2
    var newMeetingId2 = funcMeetingId();
    console.log(newMeetingId2);

    //Call Tasks table to get receiving memeberid and requesting memberId
    console.log("number is" + taskId);
    request({
        "method": "GET",
        "uri": "http://35.220.224.69:3000/readTask/" + taskId,
        "json": true
    })
        .then(function (result) {

            console.log(result);
            var jsonData = JSON.parse(result['result']);
            receivingMemberId = jsonData.receivingmemberid;
            requestingMemberId = jsonData.requestingmemberid;
            meetingDate = jsonData.proposedmeetingdate
            meetingTime = jsonData.proposedmeetingtime
            meetingReason = jsonData.proposedmeetingreason
            console.log(receivingMemberId, requestingMemberId);
        })

        .then(function () {

            var showMeetingFlag = "y";

            //Write a new meeting 1: Id:recieving id (the person who accepted the contact)
            request({
                "method": "POST",
                "uri": "http://35.220.224.69:3000/writeMeeting",
                "json": true,
                "body": {
                    "Args": [newMeetingId1, requestingMemberId, receivingMemberId, taskId, meetingDate, meetingDurationMinutes, meetingReason, showMeetingFlag, "N"]
                }
            }).then(function (result) {
                console.log(result);
            })

        })
        .then(function () {
            var showMeetingFlag = "y";

            //Write a new meeting 2: Id:recieving id (the person who accepted the contact) 
            request({
                "method": "POST",
                "uri": "http://35.220.224.69:3000/writeMeeting",
                "json": true,
                "body": {
                    "Args": [newMeetingId2, receivingMemberId, requestingMemberId, taskId, meetingDate, meetingDurationMinutes, meetingReason, showMeetingFlag, "N"]
                }
            }).then(function (result) {
                console.log("last result-------------------------" + result);
            });
        })

        .then(function () {
            //Call task status and now keep task status closed.
            var taskCreationDate = currentDate;
            console.log("the current date is" + taskCreationDate);
            var taskUpdateDate = "nil";
            var taskStatus = "closed";
            var taskType = "meeting";
            var taskCloseDate = currentDate;
            var taskClosedBy = receivingMemberId;
            var proposedMeetingDate = meetingDate;
            var proposedMeetingReason = meetingReason;
            var proposedMeetingTime = meetingDurationMinutes;
            var requestAccepted = "yes";
            var isDeleted = "no";

            request({
                "method": "POST",
                "uri": "http://35.220.224.69:3000/writeTask",
                "json": true,
                "body": {
                    "Args": [taskId, receivingMemberId, requestingMemberId, taskType, taskCreationDate, taskUpdateDate, taskStatus, taskCloseDate, taskClosedBy, proposedMeetingDate, proposedMeetingTime, proposedMeetingReason, requestAccepted, isDeleted]
                }
            })
                .then(function (result) {
                    console.log("updated the task as closed");
                    var Finalresult = {
                        "meetingId1": newMeetingId1,
                        "meetingId2 ": newMeetingId2
                    }
                    res.send(Finalresult);
                })

        })

});

//14-------------------Edit deafult sharing Rule---------------------------

app.post('/editDefaultSharingRule/:userId', urlencodedParser, function (req, res) {
    var userId = req.params.userId;
    request({
        "method": "GET",
        "uri": "http://35.220.224.69:3000/readMember/" + userId,
        "json": true,
    }).then(function (result) {
        var jsonData = JSON.parse(result['result']);
        var membername = jsonData.membername;
        var membershipdate = jsonData.membershipdate;
        var memberabout = jsonData.memberabout;
        var membershortbio = jsonData.membershortbio;
        var memberlocation = jsonData.memberlocation;
        var memberphonenumber = jsonData.memberphonenumber;
        var memberemail = jsonData.memberemail;
        var membersocialaccount = jsonData.membersocialaccount;
        var sharingdefaultmemdate = req.body.sharingdefaultmemdate;
        var sharingdefaultemail = req.body.sharingdefaultemail;
        var sharingdefaultphone = req.body.sharingdefaultphone;
        var sharingdefaultsocialacc = req.body.sharingdefaultsocialacc;
        var sharingdefaultlocation = req.body.sharingdefaultlocation;
        var sharingdefaultsetmeetings = req.body.sharingdefaultsetmeetings;
        var createdby = jsonData.createdby;
        var creationdate = jsonData.creationdate;
        var lastupdatedby = jsonData.lastupdatedby;
        var lastupdatedate = currentDate;
        var imageurl = jsonData.imageurl;
        var isdeleted = jsonData.isdeleted;

        request({
            "method": "POST",
            "uri": "http://35.220.224.69:3000/writeMember/",
            "body": {
                "Args": [userId, membername, membershipdate, memberabout, membershortbio, memberlocation, memberphonenumber, memberemail, membersocialaccount, sharingdefaultmemdate, sharingdefaultemail, sharingdefaultphone, sharingdefaultsocialacc, sharingdefaultlocation, sharingdefaultsetmeetings, createdby, creationdate, lastupdatedby, lastupdatedate, imageurl, isdeleted]
            },
            "json": true,

        }).then(function () {
            res.send('ok');
        })
    })
});



//----------------------------------sample------------------------
app.get('/', function (req, res) {
    res.send('Hello Users!');
});

app.listen(PORT);
console.log(`Running on http://localhost:${PORT}`);
