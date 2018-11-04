// HERE GOES THE CHAINCODE
package main

import (
        "bytes"
        "encoding/json"
        "fmt"
//      "strconv"
        "strings"
        //"time"
        //dt "github.com/fxtlabs/date"
        "github.com/hyperledger/fabric/core/chaincode/shim"
        pb "github.com/hyperledger/fabric/protos/peer"
)

// SimpleChaincode example simple Chaincode implementation
type SimpleChaincode struct {
}

type member struct {
        ObjectType string `json:"docType"` //docType is used to distinguish the various types of objects in state database
        MemberId       string `json:"memberid"`    //the fieldtags are needed to keep case from bouncing around
        MemberName     string `json:"membername"`
        MembershipDate       string     `json:"membershipdate"`
        MemberAbout      string `json:"memberabout"`
        MemberShortBio      string `json:"membershortbio"`
        MemberLocation      string `json:"memberlocation"`
        MemberPhoneNumber      string `json:"memberphonenumber"`
        MemberEmail      string `json:"memberemail"`
        MemberSocialAccount      string `json:"membersocialaccount"`
        SharingDefaultMemDate      string `json:"sharingdefaultmemdate"`
        SharingDefaultEmail      string `json:"sharingdefaultemail"`
        SharingDefaultPhone      string `json:"sharingdefaultphone"`
        SharingDefaultSocialAcc      string `json:"sharingdefaultsocialacc"`
        SharingDefaultLocation      string `json:"sharingdefaultlocation"`
        SharingDefaultSetMeetings      string `json:"sharingdefaultsetmeetings"`
        CreatedBy      string `json:"createdby"`
        CreationDate      string `json:"creationdate"`
        LastUpdatedBy      string `json:"lastupdatedby"`
        LastUpdateDate      string `json:"lastupdatedate"`
        ImageURL      string `json:"imageurl"`
        IsDeleted      string `json:"isdeleted"`
}
type task struct {
        ObjectType string `json:"docType"` //docType is used to distinguish the various types of objects in state database
        TaskId       string `json:"taskid"`    //the fieldtags are needed to keep case from bouncing around
        RequestingMemberId      string `json:"requestingmemberid"`
        ReceivingMemberId       string    `json:"receivingmemberid"`
        TaskType      string `json:"tasktype"`
        TaskCreationDate      string `json:"taskcreationdate"`
        TaskUpdateDate      string `json:"taskupdatedate"`
        TaskStatus      string `json:"taskstatus"`
        TaskCloseDate      string `json:"taskclosedate"`
        TaskClosedBy      string `json:"taskclosedby"`
        ProposedMeetingDate      string `json:"proposedmeetingdate"`
        ProposedMeetingTime      string `json:"proposedmeetingtime"`
        ProposedMeetingReason      string `json:"proposedmeetingreason"`
        RequestAccepted      string `json:"requestaccepted"`
        IsDeleted      string `json:"isdeleted"`
}
type contact struct {
        ObjectType string `json:"docType"` //docType is used to distinguish the various types of objects in state database
        ContactId       string `json:"contactid"`    //the fieldtags are needed to keep case from bouncing around
        RequestingMemberId      string `json:"requestingmemberid"`
        ContactMemberId       string    `json:"contactmemberid"`
        OriginatingTaskId      string `json:"originatingtaskid"`
        ContactEstablishedDate      string `json:"contactestablisheddate"`
        LocationShared      string `json:"locationshared"`
        EmailShared      string `json:"emailshared"`
        PhoneShared      string `json:"phoneshared"`
        SocialAccountShared      string `json:"socialaccountshared"`
        SetMeetingFlag      string `json:"setmeetingflag"`
        AboutShared      string `json:"aboutshared"`
        ContactStatus      string `json:"contactstatus"`
        ContactDeletedDate      string `json:"contactdeleteddate"`
        ContactDeletedBy      string `json:"contactdeletedby"`
        IsDeleted      string `json:"isdeleted"`
}
type meeting struct {
        ObjectType string `json:"docType"` //docType is used to distinguish the various types of objects in state database
        MeetingId       string `json:"meetingid"`    //the fieldtags are needed to keep case from bouncing around
        RequestingMemberId      string `json:"requestingmemberid"`
        ContactMemberId       string    `json:"contactmemberid"`
        OriginatingTaskId      string `json:"originatingtaskid"`
        MeetingDate      string `json:"meetingdate"`
        MeetingDurationMinutes      string `json:"meetingdurationminutes"`
        MeetingReason      string `json:meetingreason"`
        ShowMeetingFlag      string `json:"showmeetingflag"`
        IsDeleted      string `json:"isdeleted"`
}

// ===================================================================================
// Main
// ===================================================================================
func main() {
        err := shim.Start(new(SimpleChaincode))
        if err != nil {
                fmt.Printf("Error starting Simple chaincode: %s", err)
        }
}


// Init initializes chaincode
// ===========================
func (t *SimpleChaincode) Init(stub shim.ChaincodeStubInterface) pb.Response {
        return shim.Success(nil)
}
//Invoke - Our entry point for invocations
// ===========================
func (t *SimpleChaincode) Invoke(stub shim.ChaincodeStubInterface) pb.Response {
        function, args := stub.GetFunctionAndParameters()
        fmt.Println("invoke is running " + function)

        // Handle different functions
        switch function {
        case "initMember":
                //create a new Member by adding info, also inits contacts
                return t.initMember(stub, args)
        case "readMember":
                //read a member's info
                return t.readMember(stub, args)

        case "initTask":
                //create a new Member by adding info, also inits contacts
                return t.initTask(stub, args)
        case "readTask":
                //read a member's info
                return t.readTask(stub, args)

        case "initContact":
                //create a new Member by adding info, also inits contacts
                return t.initContact(stub, args)
        case "readContact":
                //read a member's info
                return t.readContact(stub, args)

        case "initMeeting":
                //create a new Member by adding info, also inits contacts
                return t.initMeeting(stub, args)
        case "readMeeting":
                //provide list of members by location
                return t.readMeeting(stub, args)
                
        case "queryMembersByLocation":
		// read members by locations`
                return t.queryMembersByLocation(stub, args)
        
    	case "queryTasksByReceivingMemberID":
		// Query Tasks by ReceivingMemberID
                return t.queryTasksByReceivingMemberID(stub, args)        

	case "queryLocation":
	        // read members by locations`
                return t.queryLocation(stub, args)

        case "databynotdeleted":
		//passes rich query with use_index to richqueryhandler
		return t.databynotdeleted(stub, args)

        default:
                //error
                fmt.Println("invoke did not find func: " + function)
		return shim.Error("Received unknown function invocation: " + function + ":concl")
        }
}
// ===============================================================
// Member functions - read/write a member from/to chaincode state
// ===============================================================
func (t *SimpleChaincode) initMember(stub shim.ChaincodeStubInterface, args []string) pb.Response {
        var err error

        MemberId := strings.ToLower(args[0])
        MemberName := strings.ToLower(args[1])
        MembershipDate := strings.ToLower(args[2])
        MemberAbout := strings.ToLower(args[3])
        MemberShortBio := strings.ToLower(args[4])
        MemberLocation := strings.ToLower(args[5])
        MemberPhoneNumber := strings.ToLower(args[6])
        MemberEmail := strings.ToLower(args[7])
        MemberSocialAccount := strings.ToLower(args[8])
        SharingDefaultMemDate := strings.ToLower(args[9])
        SharingDefaultEmail := strings.ToLower(args[10])
        SharingDefaultPhone := strings.ToLower(args[11])
        SharingDefaultSocialAcc := strings.ToLower(args[12])
        SharingDefaultLocation := strings.ToLower(args[13])
        SharingDefaultSetMeetings := strings.ToLower(args[14])
        CreatedBy := strings.ToLower(args[15])
        CreationDate := strings.ToLower(args[16])
        LastUpdatedBy := strings.ToLower(args[17])
        LastUpdateDate := strings.ToLower(args[18])
        ImageUrl := strings.ToLower(args[19])
        IsDeleted := strings.ToLower(args[20])
        //Contacts := strings.ToLower(args[4])

        // ==== Create member object and marshal to JSON ====
        objectType := "MemberInfo"
        member := &member{objectType, MemberId, MemberName, MembershipDate, MemberAbout, MemberShortBio, MemberLocation, MemberPhoneNumber, MemberEmail, MemberSocialAccount, SharingDefaultMemDate, SharingDefaultEmail, SharingDefaultPhone, SharingDefaultSocialAcc, SharingDefaultLocation, SharingDefaultSetMeetings, CreatedBy, CreationDate, LastUpdatedBy, LastUpdateDate, ImageUrl, IsDeleted}
        memberJSONasBytes, err := json.Marshal(member)
        if err != nil {
                return shim.Error(err.Error())
        }

        // === Save member to state ===
        err = stub.PutPrivateData("collectionMembers", MemberId, memberJSONasBytes)
        if err != nil {
                return shim.Error(err.Error())
        }

        //  ==== Index the marble to enable color-based range queries, e.g. return all blue marbles ====
        //  An 'index' is a normal key/value entry in state.
        //  The key is a composite key, with the elements that you want to range query on listed first.
        //  In our case, the composite key is based on indexName~color~name.
        //  This will enable very efficient state range queries based on composite keys matching indexName~color~*
	indexName := "memberlocation~memberid"
        locationMemberIdIndexKey, err := stub.CreateCompositeKey(indexName, []string{member.MemberLocation, member.MemberId})
        if err != nil {
                return shim.Error(err.Error())
        }
        //  Save index entry to state. Only the key name is needed, no need to store a duplicate copy of the marble.
        //  Note - passing a 'nil' value will effectively delete the key from state, therefore we pass null character as value
        value := []byte{0x00}
        stub.PutPrivateData("collectionMembers",locationMemberIdIndexKey, value)

                // ==== Member saved. Return success ====
        fmt.Println("- end init member")
        return shim.Success(nil)
}

func (t *SimpleChaincode) readMember(stub shim.ChaincodeStubInterface, args []string) pb.Response {
        var id, jsonResp string
        //var err error

        if len(args) != 1 {
                return shim.Error("Incorrect number of arguments. Expecting id of member to query")
        }

        id = strings.ToLower(args[0])
        valAsbytes, err1 := stub.GetPrivateData("collectionMembers", id) //get the member from chaincode state
        //contactsAsbytes, err2 := stub.GetPrivateData("collectionMemberContacts", name) //get the member from chaincode state
        if err1 != nil {
                jsonResp = "{\"Error\":\"Failed to get state for " + id + "\"}"
                return shim.Error(jsonResp)
        } else if valAsbytes == nil {
                jsonResp = "{\"Error\":\"Member does not exist: " + id + "\"}"
                return shim.Error(jsonResp)
        }
        fmt.Println(valAsbytes)
        return shim.Success(valAsbytes)
}

// ===============================================================
// Task functions - read/write a Task from/to chaincode state
// ===============================================================
func (t *SimpleChaincode) initTask(stub shim.ChaincodeStubInterface, args []string) pb.Response {
        var err error

        TaskId := strings.ToLower(args[0])
        RequestingMemberId := strings.ToLower(args[1])
        ReceivingMemberId := strings.ToLower(args[2])
        TaskType := strings.ToLower(args[3])
        TaskCreationDate := strings.ToLower(args[4])
        TaskUpdateDate := strings.ToLower(args[5])
        TaskStatus := strings.ToLower(args[6])
        TaskCloseDate := strings.ToLower(args[7])
        TaskClosedBy := strings.ToLower(args[8])
        ProposedMeetingDate := strings.ToLower(args[9])
        ProposedMeetingTime := strings.ToLower(args[10])
        ProposedMeetingReason := strings.ToLower(args[11])
        RequestAccepted := strings.ToLower(args[12])
        IsDeleted := strings.ToLower(args[13])
        //Contacts := strings.ToLower(args[4])


        // ==== Create task object and marshal to JSON ====
        objectType := "taskInfo"
        task := &task{objectType, TaskId, RequestingMemberId, ReceivingMemberId, TaskType, TaskCreationDate, TaskUpdateDate, TaskStatus, TaskCloseDate, TaskClosedBy, ProposedMeetingDate, ProposedMeetingTime, ProposedMeetingReason, RequestAccepted, IsDeleted}
        taskJSONasBytes, err := json.Marshal(task)
        if err != nil {
                return shim.Error(err.Error())
        }

	// === Save task to state ===
        err = stub.PutPrivateData("collectionTasks", TaskId, taskJSONasBytes)
        if err != nil {
                return shim.Error(err.Error())
        }

        //queryTasksByReceivingMemberID
	indexName := "receivingmemberid~tasks"
        receivingmemberidTasksIndexKey, err := stub.CreateCompositeKey(indexName, []string{task.ReceivingMemberId, task.TaskId})
        if err != nil {
                return shim.Error(err.Error())
        }
        //  Save index entry to state. Only the key name is needed, no need to store a duplicate copy of the marble.
        //  Note - passing a 'nil' value will effectively delete the key from state, therefore we pass null character as value
        value := []byte{0x00}
        stub.PutPrivateData("collectionTasks", receivingmemberidTasksIndexKey, value)

        // ==== Task saved. Return success ====
        fmt.Println("- end init task")
        return shim.Success(nil)
}

func (t *SimpleChaincode) readTask(stub shim.ChaincodeStubInterface, args []string) pb.Response {
        var id, jsonResp string

        if len(args) != 1 {
                return shim.Error("Incorrect number of arguments. Expecting id of the task to query")
        }

        id = strings.ToLower(args[0])
        valAsbytes, err1 := stub.GetPrivateData("collectionTasks", id) //get the member from chaincode state
        if err1 != nil {
                jsonResp = "{\"Error\":\"Failed to get state for " + id + "\"}"
                return shim.Error(jsonResp)
        } else if valAsbytes == nil {
                jsonResp = "{\"Error\":\"Task does not exist: " + id + "\"}"
                return shim.Error(jsonResp)
        }

        fmt.Println(valAsbytes)
        return shim.Success(valAsbytes)
        }

// ===============================================================
// Contact functions - read/write a Contact from/to chaincode state
// ===============================================================

func (t *SimpleChaincode) initContact(stub shim.ChaincodeStubInterface, args []string) pb.Response {
        var err error

        ContactId := strings.ToLower(args[0])
        RequestingMemberId := strings.ToLower(args[1])
        ContactMemberId := strings.ToLower(args[2])
        OriginatingTaskId := strings.ToLower(args[3])
        ContactEstablishedDate := strings.ToLower(args[4])
        LocationShared := strings.ToLower(args[5])
        EmailShared := strings.ToLower(args[6])
        PhoneShared := strings.ToLower(args[7])
        SocialAccountShared := strings.ToLower(args[8])
        SetMeetingFlag := strings.ToLower(args[9])
        AboutShared := strings.ToLower(args[10])
        ContactStatus := strings.ToLower(args[11])
        ContactDeletedDate := strings.ToLower(args[12])
        ContactDeletedBy := strings.ToLower(args[13])
        IsDeleted := strings.ToLower(args[14])
        //Contacts := strings.ToLower(args[4])


        // ==== Create task object and marshal to JSON ====
        objectType := "contactInfo"
        contact := &contact{objectType, ContactId, RequestingMemberId, ContactMemberId, OriginatingTaskId, ContactEstablishedDate, LocationShared, EmailShared, PhoneShared, SocialAccountShared, SetMeetingFlag, AboutShared, ContactStatus, ContactDeletedDate, ContactDeletedBy, IsDeleted}
        contactJSONasBytes, err := json.Marshal(contact)
        if err != nil {
                return shim.Error(err.Error())
        }

        // === Save contact to state ===
        err = stub.PutPrivateData("collectionContacts", ContactId, contactJSONasBytes)
        if err != nil {
                return shim.Error(err.Error())
        }

        // ==== Contact saved. Return success ====
        fmt.Println("- end init contact")
        return shim.Success(nil)
}

func (t *SimpleChaincode) readContact(stub shim.ChaincodeStubInterface, args []string) pb.Response {
        var id, jsonResp string

        if len(args) != 1 {
                return shim.Error("Incorrect number of arguments. Expecting name of the task to query")
        }

        id = strings.ToLower(args[0])
        valAsbytes, err1 := stub.GetPrivateData("collectionContacts", id) //get the member from chaincode state
        if err1 != nil {
                jsonResp = "{\"Error\":\"Failed to get state for " + id + "\"}"
                return shim.Error(jsonResp)
        } else if valAsbytes == nil {
                jsonResp = "{\"Error\":\"Task does not exist: " + id + "\"}"
                return shim.Error(jsonResp)
        }

        fmt.Println(valAsbytes)
        return shim.Success(valAsbytes)
}


// ===============================================================
// Meeting functions - read/write a meeting from/to chaincode state
// ===============================================================
func (t *SimpleChaincode) initMeeting(stub shim.ChaincodeStubInterface, args []string) pb.Response {
        var err error

        MeetingId := strings.ToLower(args[0])
        RequestingMemberId := strings.ToLower(args[1])
        ContactMemberId := strings.ToLower(args[2])
        OriginatingTaskId := strings.ToLower(args[3])
        MeetingDate := strings.ToLower(args[4])
        MeetingDurationMinutes := strings.ToLower(args[5])
        MeetingReason := strings.ToLower(args[6])
        ShowMeetingFlag := strings.ToLower(args[7])
        IsDeleted := strings.ToLower(args[8])
        //Contacts := strings.ToLower(args[4])


        // ==== Create meeting object and marshal to JSON ====
        objectType := "meetingInfo"
        meeting := &meeting{objectType, MeetingId, RequestingMemberId, ContactMemberId, OriginatingTaskId, MeetingDate, MeetingDurationMinutes, MeetingReason, ShowMeetingFlag, IsDeleted}
        meetingJSONasBytes, err := json.Marshal(meeting)
        if err != nil {
                return shim.Error(err.Error())
        }

        // === Save meeting to state ===
        err = stub.PutPrivateData("collectionMeetings", MeetingId, meetingJSONasBytes)
        if err != nil {
                return shim.Error(err.Error())
        }

        // ==== Meeting saved. Return success ====
        fmt.Println("- end init meeting")
        return shim.Success(nil)
}

func (t *SimpleChaincode) readMeeting(stub shim.ChaincodeStubInterface, args []string) pb.Response {
        var id, jsonResp string

        if len(args) != 1 {
                return shim.Error("Incorrect number of arguments. Expecting id of the meeting to query")
        }

        id = strings.ToLower(args[0])
        valAsbytes, err1 := stub.GetPrivateData("collectionMeetings", id) //get the meeting from chaincode state
        if err1 != nil {
                jsonResp = "{\"Error\":\"Failed to get state for " + id + "\"}"
                return shim.Error(jsonResp)
        } else if valAsbytes == nil {
                jsonResp = "{\"Error\":\"Meeting does not exist: " + id + "\"}"
                return shim.Error(jsonResp)
        }

        fmt.Println(valAsbytes)
        return shim.Success(valAsbytes)
}


// =========================================================================================
// getQueryResultForQueryString executes the passed in query string.
// Result set is built and returned as a byte array containing the JSON results.
// =========================================================================================
func getQueryResultForQueryString(stub shim.ChaincodeStubInterface, collectionName string, queryString string) ([]byte, error) {

	fmt.Printf("- getQueryResultForQueryString queryString:\n%s\n", queryString)

	//resultsIterator, err := stub.GetQueryResult(queryString)
        resultsIterator, err := stub.GetPrivateDataQueryResult(collectionName,queryString)
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	// buffer is a JSON array containing QueryRecords
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}
		// Add a comma before array members, suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"Key\":")
		buffer.WriteString("\"")
		buffer.WriteString(queryResponse.Key)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Record\":")
		// Record is a JSON object, so we write as-is
		buffer.WriteString(string(queryResponse.Value))
		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	fmt.Printf("- getQueryResultForQueryString queryResult:\n%s\n", buffer.String())

	return buffer.Bytes(), nil
}

func (t *SimpleChaincode) queryMembersByLocation(stub shim.ChaincodeStubInterface, args []string) pb.Response {
//index:
//{"index":{"fields":["docType","owner"]},"ddoc":"indexOwnerDoc", "name":"indexOwner","type":"json"}
//queryString:
//peer chaincode query -C $CHANNEL_NAME -n marbles -c '{"Args":["queryMarbles", "{\"selector\":{\"docType\":\"marble\",\"owner\":\"tom\"}, \"use_index\":[\"_design/indexOwnerDoc\", \"indexOwner\"]}"]}'
        //   0
        // "bob"
        if len(args) < 1 {
                return shim.Error("Incorrect number of arguments. Expecting 1")
        }
        location := strings.ToLower(args[0])
        queryString := fmt.Sprintf("{\"selector\":{\"docType\":\"MemberInfo\",\"memberlocation\":\"%s\"}}", location)
        queryResults, err := getQueryResultForQueryString(stub, "collectionMembers", queryString)
        if err != nil {
                return shim.Error(err.Error())
        }
        return shim.Success(queryResults)
}

//queryTasksByReceivingMemberID
func (t *SimpleChaincode) queryTasksByReceivingMemberID(stub shim.ChaincodeStubInterface, args []string) pb.Response {        
        if len(args) < 1 {
                return shim.Error("Incorrect number of arguments. Expecting 1")
        }
        receivingmemberid := strings.ToLower(args[0])
        queryString := fmt.Sprintf("{\"selector\":{\"docType\":\"taskInfo\",\"receivingmemberid\":\"%s\"}}", receivingmemberid)
        queryResults, err := getQueryResultForQueryString(stub, "collectionTasks", queryString)
        if err != nil {
                return shim.Error(err.Error())
        }
        return shim.Success(queryResults)
}