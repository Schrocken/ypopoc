const express = require('express')
const app = express()
const port = 3000
var shl = require('shelljs')
var bodyParser = require('body-parser')
app.use(bodyParser.json())

//readMeeting End Point
app.get('/readMember/:id',(request,response) => {
var cmd = 'docker exec cli peer chaincode query -C ypochannel -n tccc -c \'{"Args":["readMember","'+request.params.id+'"]}\''
console.log(cmd)
var r = shl.exec(cmd)
response.send({'success':'OK','result':r})
});

//readMeeting End Point
app.get('/readMeeting/:id',(request,response) => {
var cmd = 'docker exec cli peer chaincode query -C ypochannel -n tccc -c \'{"Args":["readMeeting","'+request.params.id+'"]}\''
console.log(cmd)
var r = shl.exec(cmd)
response.send({'success':'OK','result':r})
});

//readContact End Point
app.get('/readContact/:id',(request,response) => {
    var cmd = 'docker exec cli peer chaincode query -C ypochannel -n tccc -c \'{"Args":["readContact","'+request.params.id+'"]}\''
    console.log(cmd)
    var r = shl.exec(cmd)
    response.send({'success':'OK','result':r})
    });

//readTask End Point
app.get('/readTask/:id',(request,response) => {
    var cmd = 'docker exec cli peer chaincode query -C ypochannel -n tccc -c \'{"Args":["readTask","'+request.params.id+'"]}\''
    console.log(cmd)
    var r = shl.exec(cmd)
    response.send({'success':'OK','result':r})
    });

//queryTasksByReceivingMemberID
app.get('/queryTasksByReceivingMemberID/:id',(request,response) => {
    var cmd = 'docker exec cli peer chaincode query -C ypochannel -n tccc -c \'{"Args":["queryTasksByReceivingMemberID","'+request.params.id+'"]}\''
    console.log(cmd)
    var r = shl.exec(cmd)
    response.send({'success':'OK','result':r})
    });


//queryContactsByContactMemberID
app.get('/queryContactsByContactMemberID/:id',(request,response) => {
    var cmd = 'docker exec cli peer chaincode query -C ypochannel -n tccc -c \'{"Args":["queryContactsByContactMemberID","'+request.params.id+'"]}\''
    console.log(cmd)
    var r = shl.exec(cmd)
    response.send({'success':'OK','result':r})
    });

//queryContactsByRequestingMemberID
app.get('/queryContactsByRequestingMemberID/:id',(request,response) => {
    var cmd = 'docker exec cli peer chaincode query -C ypochannel -n tccc -c \'{"Args":["queryContactsByRequestingMemberID","'+request.params.id+'"]}\''
    console.log(cmd)
    var r = shl.exec(cmd)
    response.send({'success':'OK','result':r})
    });


//queryMeetingsByContactMemberID
app.get('/queryMeetingsByContactMemberID/:id',(request,response) => {
    var cmd = 'docker exec cli peer chaincode query -C ypochannel -n tccc -c \'{"Args":["queryMeetingsByContactMemberID","'+request.params.id+'"]}\''
    console.log(cmd)
    var r = shl.exec(cmd)
    response.send({'success':'OK','result':r})
    });

//queryAllMembers
app.get('/queryAllMembers',(request,response) => {
    var cmd = 'docker exec cli peer chaincode query -C ypochannel -n tccc -c \'{"Args":["queryAllMembers"]}\''
    console.log(cmd)
    var r = shl.exec(cmd)
    response.send({'success':'OK','result':r})
    });

/**
//MEETING
app.post('/writeMeeting', (req, res) => {
    console.log('writing meeting...')
    console.log(req.body['Args'])
    cmd = 'docker exec cli peer chaincode invoke -o orderer.schrocken-01.com:7050 --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/schrocken-01.com/orderers/orderer.schrocken-01.com/msp/tlscacerts/tlsca.schrocken-01.com-cert.pem -C ypochannel -n tccc -c \'{"Args":["initMeeting",'+'"'+req.body['Args'].join('","')+'"'+']}\''
            console.log('cmd: '+cmd)
            var r = shl.exec(cmd)
            console.log(typeof r)
            res.send({'success':'OK','result':r})
});
*/


//==========================<WRITE APIS>===========================
//MEMBER
app.post('/writeMember', (req, res) => {
    console.log('writing member...')
    console.log(req.body['Args'])
    cmd = 'docker exec cli peer chaincode invoke -o orderer.schrocken-01.com:7050 --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/schrocken-01.com/orderers/orderer.schrocken-01.com/msp/tlscacerts/tlsca.schrocken-01.com-cert.pem -C ypochannel -n tccc -c \'{"Args":["initMember",'+'"'+req.body['Args'].join('","')+'"'+']}\''
        console.log('cmd: '+cmd)
        var r = shl.exec(cmd)
        console.log(typeof r)
        res.send({'success':'OK','result':r})
    });

//TASK
app.post('/writeTask', (req, res) => {
    console.log('writing task...')
    console.log(req.body['Args'])
    cmd = 'docker exec cli peer chaincode invoke -o orderer.schrocken-01.com:7050 --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/schrocken-01.com/orderers/orderer.schrocken-01.com/msp/tlscacerts/tlsca.schrocken-01.com-cert.pem -C ypochannel -n tccc -c \'{"Args":["initTask",'+'"'+req.body['Args'].join('","')+'"'+']}\''
        console.log('cmd: '+cmd)
        var r = shl.exec(cmd)
        console.log(typeof r)
        res.send({'success':'OK','result':r})
});

//MEETING
app.post('/writeMeeting', (req, res) => {
    console.log('writing meeting...')
    console.log(req.body['Args'])
    cmd = 'docker exec cli peer chaincode invoke -o orderer.schrocken-01.com:7050 --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/schrocken-01.com/orderers/orderer.schrocken-01.com/msp/tlscacerts/tlsca.schrocken-01.com-cert.pem -C ypochannel -n tccc -c \'{"Args":["initMeeting",'+'"'+req.body['Args'].join('","')+'"'+']}\''
        console.log('cmd: '+cmd)
        var r = shl.exec(cmd)
        console.log(typeof r)
        res.send({'success':'OK','result':r})
});

//CONTACT
app.post('/writeContact', (req, res) => {
    console.log('writing contact...')
    console.log(req.body['Args'])
    cmd = 'docker exec cli peer chaincode invoke -o orderer.schrocken-01.com:7050 --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/schrocken-01.com/orderers/orderer.schrocken-01.com/msp/tlscacerts/tlsca.schrocken-01.com-cert.pem -C ypochannel -n tccc -c \'{"Args":["initContact",'+'"'+req.body['Args'].join('","')+'"'+']}\''
        console.log('cmd: '+cmd)
        var r = shl.exec(cmd)
        console.log(typeof r)
        res.send({'success':'OK','result':r})
});                                          

//==========================<Update APIs>===========================
//Update Member
app.post('/updateMember', (req, res) => {
    console.log('updating member...')
    console.log(req.body['Args'])
    cmd = 'docker exec cli peer chaincode invoke -o orderer.schrocken-01.com:7050 --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/schrocken-01.com/orderers/orderer.schrocken-01.com/msp/tlscacerts/tlsca.schrocken-01.com-cert.pem -C ypochannel -n tccc -c \'{"Args":["initMember",'+'"'+req.body['Args'].join('","')+'"'+']}\''
        console.log('cmd: '+cmd)
        var r = shl.exec(cmd)
        console.log(typeof r)
        res.send({'success':'OK','result':r})
    });

//Update Task
app.post('/updateTask', (req, res) => {
    console.log('updating task...')
    console.log(req.body['Args'])
    cmd = 'docker exec cli peer chaincode invoke -o orderer.schrocken-01.com:7050 --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/schrocken-01.com/orderers/orderer.schrocken-01.com/msp/tlscacerts/tlsca.schrocken-01.com-cert.pem -C ypochannel -n tccc -c \'{"Args":["initTask",'+'"'+req.body['Args'].join('","')+'"'+']}\''
        console.log('cmd: '+cmd)
        var r = shl.exec(cmd)
        console.log(typeof r)
        res.send({'success':'OK','result':r})
});

//Update Meeting
app.post('/updateMeeting', (req, res) => {
    console.log('updating meeting...')
    console.log(req.body['Args'])
    cmd = 'docker exec cli peer chaincode invoke -o orderer.schrocken-01.com:7050 --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/schrocken-01.com/orderers/orderer.schrocken-01.com/msp/tlscacerts/tlsca.schrocken-01.com-cert.pem -C ypochannel -n tccc -c \'{"Args":["initMeeting",'+'"'+req.body['Args'].join('","')+'"'+']}\''
        console.log('cmd: '+cmd)
        var r = shl.exec(cmd)
        console.log(typeof r)
        res.send({'success':'OK','result':r})
});

//Update Contact
app.post('/updateContact', (req, res) => {
    console.log('updating contact...')
    console.log(req.body['Args'])
    cmd = 'docker exec cli peer chaincode invoke -o orderer.schrocken-01.com:7050 --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/schrocken-01.com/orderers/orderer.schrocken-01.com/msp/tlscacerts/tlsca.schrocken-01.com-cert.pem -C ypochannel -n tccc -c \'{"Args":["initContact",'+'"'+req.body['Args'].join('","')+'"'+']}\''
        console.log('cmd: '+cmd)
        var r = shl.exec(cmd)
        console.log(typeof r)
});                                          

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
