import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';

@Injectable({
  providedIn: 'root'
})
export class ApiCallService {
  _HttpClient: any;

  constructor(private http:HttpClient) { }
 //Emisoft test cloud
//public dotnetapi = 'http://15.206.239.91:83/api';
//Emisoft cloud for customer testing
//public dotnetapi = 'http://3.111.100.109:81/api';
//Local host
 public dotnetapi = 'https://localhost:5001/api';
//Live server for Customer intranet
//public dotnetapi = 'http://192.168.10.29:81/api';
//public hostname='localhost:44381';
//Live server for Customer Cloud 
 //public dotnetapi = 'http://72.167.151.157:81/api';
  // Emisoft common Test server
//public dotnetapi = 'http://192.168.1.37:84/api';
  // Emisoft common Test cloud server
  //public dotnetapi = 'http://13.53.118.116:81/api';
 
  // common for all
  GetChartData(empcode:any,company:any)
  {
    return this.http.get<any>(`${this.dotnetapi}/MasterManagement/generatejson/${empcode}/${company}`);
  }
  FetchLeaveTypes()
  {
    return this.http.get<any>(`${this.dotnetapi}/MasterManagement/MasterComboData/${52}`);
  }
  GetCompanyLogo(id:any)
  {  
  
    return this.http.get<any>(`${this.dotnetapi}/MasterManagement/GetCompanyData/${id}`);
  }
  listCompany(comtypeid:any)
  {

    // alert(comtypeid);
    return this.http.get<any>(`${this.dotnetapi}/MasterManagement/MasterComboData/${comtypeid}`);
  }

  listDepartment(deptypeid:any)
  {
    // alert(deptypeid);
    return this.http.get<any>(`${this.dotnetapi}/MasterManagement/MasterComboData/${deptypeid}`);
  }

  //Login

  Login(data:any)
  {  
     //console.log(data); 
     return this.http.post<any>(`${this.dotnetapi}/Login/Login`,data);
  }
  CheckPasswordNull(data:any)
  {  
    return this.http.post<any>(`${this.dotnetapi}/Login/CheckPasswordNull`,data);
  }
  ChangePassword(data:any)
  {  
    return this.http.post<any>(`${this.dotnetapi}/Login/ChangePassword`,data);
  }
  ValidateOldPassword(data:any)
  {  
    return this.http.post<any>(`${this.dotnetapi}/Login/ValidateOldPassword`,data);
  }

  listEmployee(department_code:any,company_code:any)
  {
    return this.http.get<any>(`${this.dotnetapi}/MasterManagement/EmployeefilterComboData/${department_code}/${company_code}`);
  }
  listEmployeemGR(emp_code:any)

  {
    return this.http.get<any>(`${this.dotnetapi}/MasterManagement/EmployeeFechbyReportingmgr/${emp_code}`);
  }

  listStatus(tid:any)
  {
    return this.http.get<any>(`${this.dotnetapi}/MasterManagement/MasterComboData/${tid}`);
  }

  listallEmployee()
  {
    return this.http.get<any>(`${this.dotnetapi}/EmployeeManagement/UpdateDocumentEmployeeComboData`);
  }

  // For regularization component 

  listdepByComCode(company_code:any)
  {
    //alert(deptypeid);
    return this.http.get<any>(`${this.dotnetapi}/MasterManagement/DepartmentCombo_CompanyWise/${company_code}`);
  }

  ListEmpByComIdandDep(dep:any,comp:any)
  {
    return this.http.get<any>(`${this.dotnetapi}/MasterManagement/EmployeefilterComboData/${dep}/${comp}`);
  }

  listRegStatus(stattypeid:any)
  {
    return this.http.get<any>(`${this.dotnetapi}/MasterManagement/MasterComboData/${stattypeid}`);
  }

  listReguRequest(empcode:any,reqstatus:any,viewflag:any,fromdate:any,todate:any)
  {
    return this.http.get<any>(`${this.dotnetapi}/Attendance/FetchRegularizationReq/${empcode}/${reqstatus}/${viewflag}/${fromdate}/${todate}`);
  }

  listReguRequestemp(empcode:any,reqstatus:any,viewflag:any,fromdate:any,todate:any)
  {
    return this.http.get<any>(`${this.dotnetapi}/Attendance/FetchRegularizationReq/${empcode}/${reqstatus}/${viewflag}/${fromdate}/${todate}`);
  }

 
  listMisPunchedDate(empcode:any)
  {
    //alert(empcode);
    return this.http.get<any>(`${this.dotnetapi}/Attendance/Fetch_MispunchedDates/${empcode}`);
  }

  RegLoginTimeData(empcode:any,loginDate:any)
  {
    return this.http.get<any>(`${this.dotnetapi}/Attendance/Fetch_MispunchedData/${empcode}/${loginDate}`);
  }

  addregularizationReq(data:any)
  {
    return this.http.post<any>(`${this.dotnetapi}/Attendance/AddAttendanceRegularizationRequest`,data);
  }
  FetchRegReq_Filterapi(data:any)
  {
    return this.http.post<any>(`${this.dotnetapi}/Attendance/FetchRegReq_Filter`,data);
  }

  RejectRequestapi(data:any)
  {

    //alert(JSON.stringify(data))
    return this.http.post<any>(`${this.dotnetapi}/Attendance/ApproveAttendanceRegularizationRequest`,data);
  }

  EditRequestapi(data:any)
  {
    return this.http.post<any>(`${this.dotnetapi}/Attendance/ApproveAttendanceRegularizationRequest`,data);
  }

  ApproveRequestapi(data:any)
  {
    return this.http.post<any>(`${this.dotnetapi}/Attendance/ApproveAttendanceRegularizationRequest`,data);
  }
  confirmCancelRq(request_Id:any,empcode:any)
  {
    //alert(request_Id);
   // alert(empcode);
    return this.http.get<any>(`${this.dotnetapi}/Attendance/CancelRegularizationReq_ByEmp/${request_Id}/${empcode}`);
  }

 


 // For compoff component start
 listCompoffReqdt(empcode:any)
 {
   return this.http.get<any>(`${this.dotnetapi}/Attendance/FetchEligibleDate_Compoff/${empcode}`);
 }

 CompoffReqdatedtl(empcode:any,reqdate:any)
 {
   return this.http.get<any>(`${this.dotnetapi}/Attendance/FetchEligibleDateDtl_Compoff/${empcode}/${reqdate}`);
 }

 CompensationReq(emp_code:any, reqstatus:any, viewflag:any, fromdate:any, todate:any)
 {
   return this.http.get<any>(`${this.dotnetapi}/Attendance/FetchCompensationReq/${emp_code}/${reqstatus}/${viewflag}/${fromdate}/${todate}`);
 }
 
 CompensationReqFilter(data:any)
 {
   return this.http.post<any>(`${this.dotnetapi}/Attendance/FetchCompReq_Filter`,data);
 }

 AddCompoffReq(data:any)
 {
   return this.http.post<any>(`${this.dotnetapi}/Attendance/AddCompoffRequestofEmployee`,data);
 }

 ApproveCompoffReq(data:any)
 {
   return this.http.post<any>(`${this.dotnetapi}/Attendance/ApproveRejectcompoffReqByHR`,data);
 }

 CancelCompoffRequest(empcode:any,compoffId:any)
 {
   return this.http.get<any>(`${this.dotnetapi}/Attendance/cancelEmpCompoffRequest/${empcode}/${compoffId}`);
 }

 PersonalCompoffReqFilter(data:any)
 {
   return this.http.post<any>(`${this.dotnetapi}/Attendance/FetchCompoffReq_Filter_ByEmp`,data);
 }
// For compoff component end


// For overtime component
GetCompanyData(id:any)
{  
  return this.http.get<any>(`${this.dotnetapi}/MasterManagement/MasterComboData/${id}`);
}
DepartmentCombo_CompanyWise(id:any)
{  
  return this.http.get<any>(`${this.dotnetapi}/MasterManagement/DepartmentCombo_CompanyWise/${id}`);
}
EmployeefilterComboData(deptid:any,companyid:any)
{   
  return this.http.get<any>(`${this.dotnetapi}/MasterManagement/EmployeefilterComboData/${deptid}/${companyid}`);
}
StatusComboData(id:any)
{      
  return this.http.get<any>(`${this.dotnetapi}/MasterManagement/MasterComboData/${id}`);
}
EmpReq_OTDetails(req:any,fromdate:any,todate:any)
{  
  return this.http.get<any>(`${this.dotnetapi}/Attendance/GetEmpReq_OTDetails/${req}/${fromdate}/${todate}`);
}
SaveOTRequest(data:any)
{  
  return this.http.post<any>(`${this.dotnetapi}/Attendance/AddOTReq_Details`,data);
}
ApproveOrReject_EmpOTReq(data:any)
{  
  return this.http.post<any>(`${this.dotnetapi}/Attendance/ApproveOrReject_EmpOTReq`,data);
}
FetchOTReq_Filter(data:any)
{  
  return this.http.post<any>(`${this.dotnetapi}/Attendance/FetchOTReq_Filter`,data);
}

FetchOTweekly(emp_code:string,fromdate:any,todate:any)
{  
  return this.http.get<any>(`${this.dotnetapi}/Attendance/GetWeeklyOT_ByEmp/${emp_code}/${fromdate}/${todate}`);
}
FetchOTRequest(emp_code:string,reqstatus:any,level:string,fromdate:any,todate:any)
{  
  return this.http.get<any>(`${this.dotnetapi}/Attendance/FetchOTHistory/${emp_code}/${reqstatus}/${level}/${fromdate}/${todate}`);
}


 // for attendance finalization

  listFromToDates()
  {
    return this.http.get<any>(`${this.dotnetapi}/Attendance/GetComboFromToDates`);
  }
  listAttendancefnlData(attFnldata:any)
  {
    return this.http.post<any>(`${this.dotnetapi}/Attendance/FetchAttendancefinal_Filter`,attFnldata)
  }

  AssignLOP(attendancedata:any)
  {
    return this.http.post<any>(`${this.dotnetapi}/Attendance/LOPSetting`,attendancedata)
  }

  // Early late check in check out report

  listCheckinCheckout(fromdate:any,todate:any,comcode:any,empcode:any)
  {
    //alert(fromdate);
    return this.http.get<any>(`${this.dotnetapi}/ReportDashboard/EarlyLate_CheckInChecOutReport/${fromdate}/${todate}/${comcode}/${empcode}`);
  }

  //Daily attendance report

  listdailyattendance(fromdate:any,todate:any,comcode:any,empcode:any)
  {
    //alert(fromdate);
    //alert(todate);
    return this.http.get<any>(`${this.dotnetapi}/ReportDashboard/DailyAttendanceReport/${comcode}/${fromdate}/${todate}/${empcode}`);
  }

  // Manhours attendance

  listYear()
  {
    return this.http.get<any>(`${this.dotnetapi}/MasterManagement/DisplayYearList`);
  }

  listMonth(year:any)
  {
    //alert(year);
    return this.http.get<any>(`${this.dotnetapi}/MasterManagement/DisplayMonths/${year}`);
  }

  listmanhour(year:any,month:any,empcode:any)
  {
    //alert(month);
    return this.http.get<any>(`${this.dotnetapi}/ReportDashboard/ManhourReport/${year}/${month}/${empcode}`); 
  }
  

  // leave history report

  listleavehistory(fromdate:any,todate:any,emcode:any)
  {
//
    // alert(fromdate);
    // alert(todate);
    // alert(emcode);

    return this.http.get<any>(`${this.dotnetapi}/ReportDashboard/FetchLeaveHistoryData/${fromdate}/${todate}/${emcode}`);
  }

//LeaveLedger
ListLeaveLedgerReport(emp_code:any,year:any,leavetype:any)
{
  return this.http.get<any>(`${this.dotnetapi}/ReportDashboard/FetchLeaveLedger/${emp_code}/${year}/${leavetype}`);
}


  //View Attendance Data

  FetchAttendanceData(level:string,emp_code:string,fromdate:any,todate:any,flag:any){  
    // alert(level)
    // alert(emp_code)
    // alert(fromdate)
    // alert(todate)

    return this.http.get<any>(`${this.dotnetapi}/ReportDashboard/FetchPunchingDetailsofEmployee/${level}/${emp_code}/${fromdate}/${todate}/${flag}`);
  }
  FetchAttendanceData_filter(data:any){  
    //alert(JSON.stringify(data))
    return this.http.post<any>(`${this.dotnetapi}/ReportDashboard/FetchPunchingDetailsofEmployee_Filter`,data);
  }

  FetchAttendanceData_filterPersonal(data:any){  
    //alert(JSON.stringify(data))
    return this.http.post<any>(`${this.dotnetapi}/ReportDashboard/FetchPunchingDetailsofEmployee_FilterPersonal`,data);
  }
  EditAttendancebyHR(data:any){  
    //alert(JSON.stringify(data))
    return this.http.post<any>(`${this.dotnetapi}/ReportDashboard/EditAttendancebyHR`,data);
  } 
  GetShiftdate(indate:any,shift:any){  
  
    return this.http.get<any>(`${this.dotnetapi}/ReportDashboard/GetShiftdate/${indate}/${shift}`);
  }
  // compoff request

  compoffdate(emp_code:any)
  {
    return this.http.get<any>(`${this.dotnetapi}/LeaveManagement/GetCompoffDates/${emp_code}`);
  }

  addcompoffReq(data:any)
  {
    return this.http.post<any>(`${this.dotnetapi}/LeaveManagement/AddCompoffRequest`,data);
  }

  listcompoffRequest(empcode:any,reqstatus:any,viewflag:any,firstDay:any,lastDay:any)
  {
    //alert(level); alert(empcode); alert(frmdt); alert(todt);
    return this.http.get<any>(`${this.dotnetapi}/LeaveManagement/FetchCompoff_LeaveRequests/${empcode}/${reqstatus}/${viewflag}/${firstDay}/${lastDay}`);
  }

  Fetchcompoff_Filterapi(data:any)
  {
    return this.http.post<any>(`${this.dotnetapi}/LeaveManagement/FetchCompoffLeaveReq_Filter`,data);
  }

// for getting count

FetchStatusCounts_Leave(data:any){  
  //alert(JSON.stringify(data))
  return this.http.post<any>(`${this.dotnetapi}/LeaveManagement/FetchStatusCounts_Leave`,data);
}

// count with filter

FetchStatusCounts_LeaveFilter(data:any){  
 // alert(JSON.stringify(data))
  return this.http.post<any>(`${this.dotnetapi}/LeaveManagement/FetchStatusCounts_LeaveFilter`,data);
}


FetchLeaveMatrixData(data:any){  
  //alert(JSON.stringify(data))
  return this.http.post<any>(`${this.dotnetapi}/LeaveManagement/FetchLeaveMatrixData`,data);
}

FetchLeaveMatrixDataFilter(data:any){  
  //alert(JSON.stringify(data))
  return this.http.post<any>(`${this.dotnetapi}/LeaveManagement/FetchLeaveMatrixDataFilter`,data);
}


// permission


FetchPermissionRequest(emp_code:string,reqstatus:any,viewflag:any,fromdate:any,todate:any){  
  //alert(level)
  //alert(emp_code)
  //alert(fromdate)
  //alert(todate)

  return this.http.get<any>(`${this.dotnetapi}/LeaveManagement/FetchPermissionRequest/${emp_code}/${reqstatus}/${viewflag}/${fromdate}/${todate}`);
}

FetchPermissionRequest_Filter(data:any){  
  //alert(JSON.stringify(data))
  return this.http.post<any>(`${this.dotnetapi}/LeaveManagement/FetchPermissionRequest_Filter`,data);
}

AddLeavePermission(data:any){  
  //alert(JSON.stringify(data))
  return this.http.post<any>(`${this.dotnetapi}/LeaveManagement/AddLeavePermission`,data);
}

displayGeneralData(company_code:string,value_type:string){  
  //alert(company_code)
  //alert(value_type)  
  return this.http.get<any>(`${this.dotnetapi}/MasterManagement/displayGeneralData/${company_code}/${value_type}`);
}

ApproveRejectLeavePermissions(data:any){  
  //alert(JSON.stringify(data))
  return this.http.post<any>(`${this.dotnetapi}/LeaveManagement/ApproveRejectLeavePermissions`,data);
}

// Annual Leave planner Start
FetchAnnualLeavePLanner(empcode:string){
  return this.http.get<any>(`${this.dotnetapi}/LeaveManagement/FetchAnnualLeavePlannerDtl/${empcode}`);
}
      
CancelAnnualLeavePLanner(empcode:string, planID:any){
  return this.http.get<any>(`${this.dotnetapi}/LeaveManagement/CancelAnnualLeavePlanner/${empcode}/${planID}`);
}

SaveAnnualLeave(data:any){  
  return this.http.post<any>(`${this.dotnetapi}/LeaveManagement/AnnualLeavePlannerByEmployee`,data);
}

LeaveApplyFinalDate(company_code:any,type:any)
{
  return this.http.get<any>(`${this.dotnetapi}/MasterManagement/displayGeneralData/${company_code}/${type}`);
}
// Annual Leave planner end

// Biometric Data start
FetchPunchingDetailsofEmployee(fromdate:any,todate:any,empcode:any)
{
return this.http.get<any>(`${this.dotnetapi}/ReportDashboard/Bio_FetchPunchingDetailsofEmployee/${fromdate}/${todate}/${empcode}`);
}
FetchPunchingDetailsofEmployee_filter(data:any)
{
return this.http.post<any>(`${this.dotnetapi}/ReportDashboard/Bio_FetchPunchingDetailsofEmployee_Filter`,data);
}
// Biometric Data End

 //BusinessTrip
 ListBusinessTripLevelwise(empcode:any,reqstatus:any,viewflag:any,fromdate:any,todate:any){  

  return this.http.get<any>(`${this.dotnetapi}/LeaveManagement/FetchBusinessTrip/${empcode}/${reqstatus}/${viewflag}/${fromdate}/${todate}`);
}

ListBusinessTripFilter(data:any){  
  return this.http.post<any>(`${this.dotnetapi}/LeaveManagement/FetchBusinessTrip_Filter`,data);
}

ApproveRejectBusinesstripReq(data:any){  
  return this.http.post<any>(`${this.dotnetapi}/LeaveManagement/ApproveRejectBusinesstripReq`,data);
}
AddBussinessTripRequest(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/LeaveManagement/AddBusinessTripRequest`,data);
}
CancelBusinessTripRequest(Empcode:any,ReqID:any)
{
  return this.http.get<any>(`${this.dotnetapi}/LeaveManagement/CancelBusinessTripRequest_ByEmployee/${Empcode}/${ReqID}`);
}
Uploadbiometricdata(data:any,empcode:any)
{
  
  return this.http.post<any>(`${this.dotnetapi}/File/Uploadcsv/${empcode}`,data);
}
listLeaveRequest(empcode:any,reqstatus:any,viewflag:any,fmdt:any,todt:any)
{   

  return this.http.get<any>(`${this.dotnetapi}/LeaveManagement/FetchLeaveRequests/${empcode}/${reqstatus}/${viewflag}/${fmdt}/${todt}`);
} 
FetchLeaveReq_Filterapi(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/LeaveManagement/FetchLeaveReq_Filter`,data);
} 
FetchLeaveReq_Filter_ByEmp(data:any){  
  //alert(JSON.stringify(data))
  return this.http.post<any>(`${this.dotnetapi}/LeaveManagement/FetchLeaveReq_Filter_ByEmp`,data);
} 
ApproveRejectLeaveReq(data:any){  
  //alert(JSON.stringify(data))
  return this.http.post<any>(`${this.dotnetapi}/LeaveManagement/ApproveRejectLeaveReq`,data);
}  
CancelLeave_ByEmployee(reqId:any,empcode:string){ 
   
  return this.http.get<any>(`${this.dotnetapi}/LeaveManagement/CancelLeaveRequest_ByEmployee/${empcode}/${reqId}`);
}
FetchAvailableLeaves(empcode:string,typeid:any){         
  //alert(typeid)
  return this.http.get<any>(`${this.dotnetapi}/LeaveManagement/FetchAvailableLeaves/${empcode}/${typeid}`);
}
LeaveDuration(dur_typeid:any){
  //alert(dur_typeid)
  return this.http.get<any>(`${this.dotnetapi}/MasterManagement/MasterComboData/${dur_typeid}`);
}
LeaveSession(LvSession_typeid:any){
  //alert(dur_typeid)
  return this.http.get<any>(`${this.dotnetapi}/MasterManagement/MasterComboData/${LvSession_typeid}`);
}
listLeaveTypes()  {   

  return this.http.get<any>(`${this.dotnetapi}/LeaveManagement/ListLeaveTypes`);
}
CountryDetails(){
   
  return this.http.get<any>(`${this.dotnetapi}/MasterManagement/FetchCountryDetails`);
}
addLeaveReq(data:any)
{
   //alert("hlo")
  return this.http.post<any>(`${this.dotnetapi}/LeaveManagement/AddNewLeaveRequest`,data);
}
ApproveRejectLeaveCompoff(data:any){  
  //alert(JSON.stringify(data))
  return this.http.post<any>(`${this.dotnetapi}/LeaveManagement/ApproveRejectCompoff_LeaveReq`,data);
}

Cancelcompoff_ByEmployee(emp_code:any,req_id:any){ 
  // alert(req_id);    
   //alert(emp_code);
  return this.http.get<any>(`${this.dotnetapi}/LeaveManagement/CancelCompoff_LeaveReq/${emp_code}/${req_id}`);
}
listpersonalFilter(empcode:any,reqstatus:any,viewflag:any,fromdate:any,todate:any)
{
  //alert(empcode);
  return this.http.get<any>(`${this.dotnetapi}/LeaveManagement/FetchCompoff_LeaveRequests/${empcode}/${reqstatus}/${viewflag}/${fromdate}/${todate}`);
}
FetchLeaveSummary(leveltype:any,fromdate:any,todate:any,empcode:any,selectedemp:any)
{
  return this.http.get<any>(`${this.dotnetapi}/LeaveManagement/FetchLeaveSummary/${leveltype}/${fromdate}/${todate}/${empcode}/${selectedemp}`);
}
CancelRequests(empcode:string,reqId:any,req_category:string)
{ 
  return this.http.get<any>(`${this.dotnetapi}/LeaveManagement/Cancel_Requests/${empcode}/${reqId}/${req_category}`);
}
Uploadleavedoc(filesup:any,reqid:any)
{
  return this.http.post<any>(`${this.dotnetapi}/File/LeaveDocUpload/${reqid}`,filesup);
}
listmispunch_nonmarkingapi(empcode:any)
{
  
  return this.http.get<any>(`${this.dotnetapi}/Attendance/Fetch_mispunched_nonmarkingcount/${empcode}`);
}

listmispunch_nonmarkingdataapi(pflag:any,empcode:any)
{
  return this.http.get<any>(`${this.dotnetapi}/Attendance/Fetch_mispunched_nonmarkingData/${pflag}/${empcode}`);
}


AttendanceProcessingFnApi(data:any){  
  //alert(JSON.stringify(data))
  return this.http.post<any>(`${this.dotnetapi}/Attendance/AttendanceProcessing`,data);
}

//YearlyLeaveReport
 
ListYearlyLeaveReport(year:any,leavetype:any,empcode:any)
{
  return this.http.get<any>(`${this.dotnetapi}/ReportDashboard/YearlyLeaveReport/${year}/${leavetype}/${empcode}`);
}

//Status Approve list 
StatusApproveList(flag:any,reqid:any,req_category:any)
{
  return this.http.get<any>(`${this.dotnetapi}/LeaveManagement/ApproverDetails/${flag}/${reqid}/${req_category}`);
}
attendanceprocessdateApi()
{
  return this.http.get<any>(`${this.dotnetapi}/Attendance/GetLastprocesseddate`);
}
// For shift assignment

listshift()
{
  return this.http.get<any>(`${this.dotnetapi}/Attendance/ShiftComboData`);
}
Fetchshiftdetail(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/Attendance/FetchWeekly_shiftData`,data);
}
Assign_EmpShift(data:any)
{  
   return this.http.post<any>(`${this.dotnetapi}/Attendance/AddShiftAssignment`,data);
}
AddEdit_SingleShift(data:any)
{  
   return this.http.post<any>(`${this.dotnetapi}/Attendance/AddEdit_SingleShift`,data);
}
FetchEmpUnderRole(grpname:any,empcode:any,flag:any)
{
  return this.http.get<any>(`${this.dotnetapi}/Attendance/FetchEmpUnderRole/${grpname}/${empcode}/${flag}`);
}


//employee profile start

listemprole(roleid:any)
{
  return this.http.get<any>(`${this.dotnetapi}/MasterManagement/MasterComboData/${roleid}`);
}
employeecodedisplay(company_id:any)
{
  return this.http.get<any>(`${this.dotnetapi}/EmployeeManagement/GetEmpCode/${company_id}`);
}
listWorkloc(worklocid:any)
{
  return this.http.get<any>(`${this.dotnetapi}/MasterManagement/MasterComboData/${worklocid}`);
}
listDesignation(desigid:any)
{
  return this.http.get<any>(`${this.dotnetapi}/MasterManagement/MasterComboData/${desigid}`);
}
listGrade(gradeid:any)
{
  return this.http.get<any>(`${this.dotnetapi}/MasterManagement/MasterComboData/${gradeid}`);
}
listEmptype(emptypeid:any)
{
  return this.http.get<any>(`${this.dotnetapi}/MasterManagement/MasterComboData/${emptypeid}`);
}

listWeekoff(weekoffId:any)
{
  return this.http.get<any>(`${this.dotnetapi}/MasterManagement/MasterComboData/${weekoffId}`);
}
listinsurancetype(insuranceid:any)
{
  return this.http.get<any>(`${this.dotnetapi}/MasterManagement/MasterComboData/${insuranceid}`);
}
lisprjtmngr(prmngr_roleid:any)
{

  return this.http.get<any>(`${this.dotnetapi}/EmployeeManagement/GetProCoordinatorandReportingManager/${prmngr_roleid}`);
}
listcoordinators(coord_roleid:any)
{
  return this.http.get<any>(`${this.dotnetapi}/EmployeeManagement/GetProCoordinatorandReportingManager/${coord_roleid}`);
}
listgender(genderid:any)
{
  return this.http.get<any>(`${this.dotnetapi}/MasterManagement/MasterComboData/${genderid}`);
}
listmaritalsts(maritalid:any)
{
  return this.http.get<any>(`${this.dotnetapi}/MasterManagement/MasterComboData/${maritalid}`);
}
listsponsordtl(sponsorid:any)
{
  return this.http.get<any>(`${this.dotnetapi}/MasterManagement/MasterComboData/${sponsorid}`);
}
listaccomodationtype()
{
  return this.http.get<any>(`${this.dotnetapi}/EmployeeManagement/GetAccommodation_code`);
}
listworkingdays(workingdaysid:any)
{
  return this.http.get<any>(`${this.dotnetapi}/MasterManagement/MasterComboData/${workingdaysid}`);
}
listairticketeligibility(airticketid:any)
{
  return this.http.get<any>(`${this.dotnetapi}/MasterManagement/MasterComboData/${airticketid}`);
}
listbanknames()
{
  return this.http.get<any>(`${this.dotnetapi}/EmployeeManagement/FetchBankNames`);
}
listbankdet(bankid:any)
{
  return this.http.get<any>(`${this.dotnetapi}/EmployeeManagement/FetchBankDetails/${bankid}`);
}
listassetscat(assetscategoryid:any)
{
  return this.http.get<any>(`${this.dotnetapi}/MasterManagement/MasterComboData/${assetscategoryid}`);
}
listassetssts(assetsstatusid:any)
{
  return this.http.get<any>(`${this.dotnetapi}/MasterManagement/MasterComboData/${assetsstatusid}`);
}
employeeassetdisplay(cat_id:any)
{
  return this.http.get<any>(`${this.dotnetapi}/EmployeeManagement/FetchAssestName/${cat_id}`);
}
employeeassetdisplaycost(cat_id:any,assetid:any)
{
  return this.http.get<any>(`${this.dotnetapi}/EmployeeManagement/FetchAssestCost/${cat_id}/${assetid}`);
}
addbasicdtls(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/EmployeeManagement/AddEmployeeBasicDetails`,data);
}
addcontactdetails(data:any)
{
  //alert("sf");
  return this.http.post<any>(`${this.dotnetapi}/EmployeeManagement/AddEmployeeContactDetails`,data);
}
adddocsdtls(data:any)
{
 // alert(JSON.stringify(data));
  return this.http.post<any>(`${this.dotnetapi}/EmployeeManagement/SaveDocuments`,data);
}
addbankdtls(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/EmployeeManagement/AddEmployeeBankDetails`,data);
}
addsalarydtls(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/EmployeeManagement/AddEmployeeSalaryDetails`,data);
}

addassetsdtls(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/EmployeeManagement/AddEmployeeAssestsDetails`,data);
}
addnomineedtls(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/EmployeeManagement/AddEmployeeNomineeDetails`,data);
}

addprofesionaldtls(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/EmployeeManagement/AddEmployeeProffessionalDetails`,data);
}


listassetsdetails(employee_code:any)
{
  return this.http.get<any>(`${this.dotnetapi}/EmployeeManagement/FetchEmployeeAssestDetails/${employee_code}`); 
}

listnomineedetails(employee_code:any)
{
  return this.http.get<any>(`${this.dotnetapi}/EmployeeManagement/FetchEmployeeNomineeDetails/${employee_code}`); 
}

listeducation(educationid:any)
{
  return this.http.get<any>(`${this.dotnetapi}/MasterManagement/MasterComboData/${educationid}`);
}
listfieldofstudy(fieldid:any)
{
  return this.http.get<any>(`${this.dotnetapi}/MasterManagement/MasterComboData/${fieldid}`);
}
listjobtitle(jobtitleid:any)
{
  return this.http.get<any>(`${this.dotnetapi}/MasterManagement/MasterComboData/${jobtitleid}`);
}
listexperience(experience:any)
{
  return this.http.get<any>(`${this.dotnetapi}/MasterManagement/MasterComboData/${experience}`);
}
listlanguages(languagesid:any)
{
  return this.http.get<any>(`${this.dotnetapi}/MasterManagement/MasterComboData/${languagesid}`);
}
listproficiency(proficiencyid:any)
{
  return this.http.get<any>(`${this.dotnetapi}/MasterManagement/MasterComboData/${proficiencyid}`);
}

listrelation(relationid:any)
{
  return this.http.get<any>(`${this.dotnetapi}/MasterManagement/MasterComboData/${relationid}`);
}

listsalarycomp(salcompid:any)
{
  return this.http.get<any>(`${this.dotnetapi}/MasterManagement/MasterComboData/${salcompid}`);
}

fetchperfesionaldtls(empcode:any,catgry:any)
{

  // alert(empcode)
  // alert(catgry)
  return this.http.get<any>(`${this.dotnetapi}/EmployeeManagement/FetchEmployeeProffessionalDetails/${empcode}/${catgry}`);
}

listnonactiveEmp()
{
  return this.http.get<any>(`${this.dotnetapi}/EmployeeManagement/EmployeeFetchTemp`);
}

activateEmp(activeData:any)
{
 //alert(JSON.stringify(activeData));
  return this.http.post<any>(`${this.dotnetapi}/EmployeeManagement/ActivateEmployee`,activeData);
}
deleteEmp(deleteData:any)
{
  //alert(JSON.stringify(deleteData));
  return this.http.post<any>(`${this.dotnetapi}/EmployeeManagement/ActivateEmployee`,deleteData);
}


fetchstatusflag(empcd:any)
{
  return this.http.get<any>(`${this.dotnetapi}/EmployeeManagement/GetProfilestatus/${empcd}`);
}



// employee profile end

Checkleavepolicy(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/LeaveManagement/Checkleavepolicy`,data);
}

FetchLeaveBalance(empcode:any)
{
  return this.http.get<any>(`${this.dotnetapi}/LeaveManagement/FetchLeaveBalance/${empcode}`);
}
ExportToExcel(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/File/WriteExcelFile`,data);
}
GetExcelFile(filename:any)
{
  let urls=`${this.dotnetapi}/File/GetExcel/${filename}`;
   return urls;
}

//employee profile view


listcontactdetails(employee_code:any)
{
  return this.http.get<any>(`${this.dotnetapi}/EmployeeManagement/FetchEmployeeContactDetails/${employee_code}`); 
}

listAlldocumentdetails(employee_code:any)
{
  return this.http.get<any>(`${this.dotnetapi}/EmployeeManagement/FetchEmployeeAllDocumentDetails/${employee_code}`); 
}

listsalarydetails(employee_code:any)
{
  return this.http.get<any>(`${this.dotnetapi}/EmployeeManagement/FetchEmployeeBankDetails/${employee_code}`); 
}

listAllowance(employee_code:any)
{
  return this.http.get<any>(`${this.dotnetapi}/EmployeeManagement/FetchEmployeeAllowanceDetails/${employee_code}`); 
}

EmployeeBasicdetails(employee_code:any)
{

  //alert(employee_code);
  return this.http.get<any>(`${this.dotnetapi}/EmployeeManagement/FetchEmpBasicDetails/${employee_code}`); 
}
EmployeeProfileBasicdetails(employee_code:any)
{

  //alert(employee_code);
  return this.http.get<any>(`${this.dotnetapi}/EmployeeManagement/FetchEmpProfileBasicDetails/${employee_code}`); 
}
FetchReportess(employee_code:any)
{
  return this.http.get<any>(`${this.dotnetapi}/EmployeeManagement/FetchReportess/${employee_code}`); 
}
displayallowance(employee_code:any)
{

  //alert(employee_code);
  return this.http.get<any>(`${this.dotnetapi}/EmployeeManagement/FetchEmployeeAllowanceDetails/${employee_code}`); 
}

fetchdocdtls(employee_code:any)
{
  return this.http.get<any>(`${this.dotnetapi}/EmployeeManagement/FetchEmployeeDocumentDetails/${employee_code}`); 
}
fetchcontactdtl(employee_code:any)
{
  //alert(employee_code);
  return this.http.get<any>(`${this.dotnetapi}/EmployeeManagement/FetchEmployeeContactDetails/${employee_code}`); 
}

displaybasicdetails(employee_code:any)
{
  return this.http.get<any>(`${this.dotnetapi}/EmployeeManagement/Fetch_EmpBasic_Edit/${employee_code}`); 
}
listaccomodationtypes(accomodationid:any)
{
  return this.http.get<any>(`${this.dotnetapi}/MasterManagement/MasterComboData/${accomodationid}`);
}

UploadEmpdoc(filesup:any,doctype:any,ecode:any,upflag:any)
{
  //alert("ff");
  return this.http.post<any>(`${this.dotnetapi}/File/EmployeeDocUpload/${doctype}/${ecode}/${upflag}`,filesup);
}
UploadEmpbasic(filesup:any,doctype:any,ecode:any,upflag:any)
{
  //alert(doctype)
  return this.http.post<any>(`${this.dotnetapi}/File/EmployeeDocUpload/${doctype}/${ecode}/${upflag}`,filesup);
}
UploadEmpeducation(filesup:any,doctype:any,ecode:any,upflag:any)
{
  return this.http.post<any>(`${this.dotnetapi}/File/EmployeeDocUpload/${doctype}/${ecode}/${upflag}`,filesup);
}
UploadEmpexperience(filesup:any,doctype:any,ecode:any,upflag:any)
{
  //alert("fg")
  return this.http.post<any>(`${this.dotnetapi}/File/EmployeeDocUpload/${doctype}/${ecode}/${upflag}`,filesup);
}
UploadEmpcertificate(filesup:any,doctype:any,ecode:any,upflag:any)
{
  return this.http.post<any>(`${this.dotnetapi}/File/EmployeeDocUpload/${doctype}/${ecode}/${upflag}`,filesup);
}

// employee directory list

fetchempdirectoylist(empcode:any)
{
 // let hostnm=this.dotnetapi;
 // alert(hostnm)
  return this.http.get<any>(`${this.dotnetapi}/EmployeeManagement/FetchEmployeeDetails/${empcode}`);
}

fetchempviewdirectoylist(empcd:any)
{
  return this.http.get<any>(`${this.dotnetapi}/EmployeeManagement/FetchEmployeeProfile/${empcd}`);
}
//Expense Claim
listExpenseCategory(typeid:any)
{
  return this.http.get<any>(`${this.dotnetapi}/MasterManagement/MasterComboData/${typeid}`);
}
listCurrency()
{
  return this.http.get<any>(`${this.dotnetapi}/Payroll/CurrencyData`);
}
AddExpenseClaimRequests(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/Payroll/AddExpenseClaimRequest`,data);
}
ExpenseClaimFilter(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/Payroll/FetchExpenseClaim_Filter`,data);
}
ExpenseClaimListData(empcode:any,reqstatus:any,viewflag:any,fromdate:any,todate:any)
{
  return this.http.get<any>(`${this.dotnetapi}/Payroll/FetchExpenseClaim/${empcode}/${reqstatus}/${viewflag}/${fromdate}/${todate}`);
}
ApproveorRejectExpenseClaim(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/Payroll/ApproveRejectExpenseClaimReq`,data);
}
Getmaxlevel(emp_code:any)
{
  return this.http.get<any>(`${this.dotnetapi}/Payroll/Fetch_MaxlevelEmployee/${emp_code}`);
}
PayrollApproveList(flag:any,reqid:any,req_category:any)
{
  return this.http.get<any>(`${this.dotnetapi}/Payroll/PayrollApproverDetails/${flag}/${reqid}/${req_category}`);
}
//Approve Level Settings
FetchAuthorityName(role:any)
{
  //alert(role)
  return this.http.get<any>(`${this.dotnetapi}/EmployeeManagement/FetchAuthorityName/${role}`);
}
FetchAuthorityDetails(empcode:any)
{

  return this.http.get<any>(`${this.dotnetapi}/EmployeeManagement/FetchAuthorityDetails/${empcode}`);
}
FetchAuthorityDetails_Filter(data:any)
{
 //alert(JSON.stringify(data))
  return this.http.post<any>(`${this.dotnetapi}/EmployeeManagement/FetchAuthorityDetails_Filter`,data);
}
AddApproveLevel(data:any)
{
 //alert(JSON.stringify(data))
  return this.http.post<any>(`${this.dotnetapi}/EmployeeManagement/AddApproveLevel`,data);
}
UploadExpenseDoc(filesup:any,reqid:any)
{
  
  return this.http.post<any>(`${this.dotnetapi}/File/ExpenseclaimDocUpload/${reqid}`,filesup);
}
UploadDirectory(ecode:any,newcode:any)
{
  return this.http.get<any>(`${this.dotnetapi}/File/UpdateDirectory/${ecode}/${newcode}`);
}
GetEmployeeDocs(ecode:any,doctype:any,upflag:any,fname:any)
{
 // alert("Fdf")
  let urls=`${this.dotnetapi}/File/GetEmployeeDocs/${doctype}/${ecode}/${upflag}/${fname}`;
  //alert(urls)
  return urls;
}
GetExpenseclaimFile(reqid:any,docname:any)
{
  let urls=`${this.dotnetapi}/File/GetExpenseClaimDocs/${reqid}/${docname}`;
   return urls;
}
//ot request count
OTRequestCount(fromdate:any,todate:any,empcode:any)
{
  return this.http.get<any>(`${this.dotnetapi}/Attendance/OTRequestCount/${fromdate}/${todate}/${empcode}`); 
}
fetchbankdtls(employee_code:any)
{
  return this.http.get<any>(`${this.dotnetapi}/EmployeeManagement/FetchEmployeeBankDetailsFromTmp/${employee_code}`); 
}

//Monthly Attendance Report
FetchMonthlyAttendance(month:any,year:any,company:any,empcode:any)
{
  return this.http.get<any>(`${this.dotnetapi}/ReportDashboard/FetchMonthlyAttendanceReportData/${month}/${year}/${company}/${empcode}`); 
}

//Monthly Attendance Report Excel
FetchMonthlyAttendanceExcel(month:any,year:any,company:any,empcode:any)
{
  return this.http.get<any>(`${this.dotnetapi}/ReportDashboard/FetchMonthlyAttendanceReportExcel/${month}/${year}/${company}/${empcode}`); 
}

//Loan 
GetGratuityAmount(empcode:any)
{
  return this.http.get<any>(`${this.dotnetapi}/Payroll/FetchGratuityAmount/${empcode}`);
}
AddLoanRequests(data:any)
{
    return this.http.post<any>(`${this.dotnetapi}/Payroll/AddLoanRequest`,data);
}
LoanRequestListData(empcode:any,reqstatus:any,viewflag:any,fromdate:any,todate:any)
{
  
  return this.http.get<any>(`${this.dotnetapi}/Payroll/Fetch_LoanRequests/${empcode}/${reqstatus}/${viewflag}/${fromdate}/${todate}`);
}
FetchLoanRequest_Filter(data:any)
{
    return this.http.post<any>(`${this.dotnetapi}/Payroll/FetchLoanRequest_Filter`,data);
}
ApproveRejectLoanRequest(data:any)
{
    return this.http.post<any>(`${this.dotnetapi}/Payroll/ApproveRejectLoanRequest`,data);
}
EditLoan_ByHR(data:any)
{
    return this.http.post<any>(`${this.dotnetapi}/Payroll/EditLoan_ByHR`,data);
}
LoanPaymentDetails(empcode:any,reqid:any)
{
  return this.http.get<any>(`${this.dotnetapi}/Payroll/Fetch_LoanPaymentDetails/${empcode}/${reqid}`);
}
PayrollApproverDetails(flag:any,reqid:any,req_category:any)
{
  return this.http.get<any>(`${this.dotnetapi}/Payroll/PayrollApproverDetails/${flag}/${reqid}/${req_category}`);
}

//loan management
UpdateLoanStatus_ByHR(empcode:any,reqid:any,status:any,remarks:any)
{
  return this.http.get<any>(`${this.dotnetapi}/Payroll/UpdateLoanStatus_ByHR/${empcode}/${reqid}/${status}/${remarks}`);
}

//Bonus Allowance

FetchEmployeeDesignationAndDOJ(emp_code:string)
{  
  return this.http.get<any>(`${this.dotnetapi}/Payroll/FetchEmployeeDesignationAndDOJ/${emp_code}`);
}
SaveBonusAllowance(data:any)
{
    return this.http.post<any>(`${this.dotnetapi}/Payroll/SaveBonusAllowance`,data);
}
UploadBonus(data:any,mon:any,year:any,mode:any,user:any)
{
  
    return this.http.post<any>(`${this.dotnetapi}/File/UploadBonus/${mon}/${year}/${mode}/${user}`,data);
}
//Salary Revision
SaveSalaryRevision(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/Payroll/SaveSalaryRevision`,data);
}
AddnewAllowance(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/Payroll/AddAllowanceComponent`,data);
}
SalaryRevisionBulkUpload(data:any,empcode:any)
{
  return this.http.post<any>(`${this.dotnetapi}/File/UploadSalaryRev/${empcode}`,data);
}
SalaryRevisionTemplate(template:any)
{
  let urls=`${this.dotnetapi}/File/GetExcelTemplates/${template}`;
   return urls;
}

//overtime report
FetchOvertimeReport(fromdate:any,todate:any,company:any,empcode:any)
{
  return this.http.get<any>(`${this.dotnetapi}/ReportDashboard/FetchOvertimeReport/${fromdate}/${todate}/${company}/${empcode}`); 
}

//Sub contractor timesheet 
FetchSubContractorTimeSheet(month:any,year:any,company:string,empcode:any)
{  
  return this.http.get<any>(`${this.dotnetapi}/ReportDashboard/FetchSubContractorTimeSheet/${month}/${year}/${company}/${empcode}`);
}

listprocesstype(processid:any)
{
  return this.http.get<any>(`${this.dotnetapi}/MasterManagement/MasterComboData/${processid}`);
}

listpaymode(paymodeid:any)
{
  return this.http.get<any>(`${this.dotnetapi}/MasterManagement/MasterComboData/${paymodeid}`);
}

Editassetdtls(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/EmployeeManagement/UpdateAssestDetails`,data);
}

Editnomineedtls(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/EmployeeManagement/UpdateNomineeDetails`,data);
}

fetchassetnm()
{

  return this.http.get<any>(`${this.dotnetapi}/EmployeeManagement/FetchAssestsname`);
}

Editprofdtl(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/EmployeeManagement/UpdateProffessionalDetails`,data);
}


listmandocs()
{
  return this.http.get<any>(`${this.dotnetapi}/EmployeeManagement/FetchMandatoryDocument`);
}

listmandocsloop()
{
  return this.http.get<any>(`${this.dotnetapi}/EmployeeManagement/FetchNonMandatoryDocument`);
}


Editdocuments(data:any)
{
  //alert("1");
  
  return this.http.post<any>(`${this.dotnetapi}/EmployeeManagement/UpdateDocumentDetails`,data);
}

addmanfiled(doctypenm:any,mansts:any)
{
  return this.http.get<any>(`${this.dotnetapi}/EmployeeManagement/SaveDocumentMaster/${mansts}/${doctypenm}`);

  
}

updatecontactdetails(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/EmployeeManagement/UpdateEmployeeContactDetails`,data);
}


updatebankdtls(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/EmployeeManagement/UpdateEmployeeBankDetails`,data);
}

updatebasicdtls(data:any)
{
  //alert('dff')
  return this.http.post<any>(`${this.dotnetapi}/EmployeeManagement/UpdateEmployeeBasicDetails`,data);
}

deleteemployeedtls(empcode:any,record_id:any,Sflag:any)
{
  //alert("SDf")
    return this.http.get<any>(`${this.dotnetapi}/EmployeeManagement/Delete_EmployeeDetails/${empcode}/${record_id}/${Sflag}`);
}
//Leave Management
FetchPendingCount_LeaveMngment(viewflag:any, empcode:any)
{
  return this.http.get<any>(`${this.dotnetapi}/LeaveManagement/FetchPendingCount_LeaveMngment/${viewflag}/${empcode}`);
}
//Download documentss in leave page
DownloadLeaveDocuments(activereqid:any)
{
  let urls=`${this.dotnetapi}/File/GetLeavDocs/${activereqid}`;
   return urls;
}

//Airtickets Booking
FetchAirtickets(empcode:any)
{
  return this.http.get<any>(`${this.dotnetapi}/LeaveManagement/FetchAirtickets/${empcode}`);
}
FetchAirtickets_Filter(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/LeaveManagement/FetchAirtickets_Filter`,data);
}
UploadAirticket(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/LeaveManagement/UpdateAirTicket_DocUpload`,data);
}
ViewAirticket(activereqid:any,flag:any)
{
  let urls=`${this.dotnetapi}/File/GetAirticket/${activereqid}/${flag}`;
   return urls;
}
AirTicketDocUpload(data:any,reqid:any,flag:any)
{
  return this.http.post<any>(`${this.dotnetapi}/File/AirTicketDocUpload/${reqid}/${flag}`,data);
}

listContractor(contractorid:any)
{
  return this.http.get<any>(`${this.dotnetapi}/MasterManagement/MasterComboData/${contractorid}`);
}

// Annual Leave Planner View
FetchAnnualLeaves(year:any,company:any,empcode:any,roleid:any,department:any)
{
  return this.http.get<any>(`${this.dotnetapi}/ReportDashboard/FetchAnnualLeavePlanner_View/${year}/${company}/${empcode}/${roleid}/${department}`); 
}

edusubmit(fieldids:any,fieldname:any)
{
  return this.http.get<any>(`${this.dotnetapi}/EmployeeManagement/SaveProfessionalfields/${fieldids}/${fieldname}`);
}

fetchemp_completests(activests:any,completests:any,empcode:any)
{
  return this.http.get<any>(`${this.dotnetapi}/EmployeeManagement/FetchempCompletests/${activests}/${completests}/${empcode}`);
}


//Request Management
FetchCompReq_Filter_HR(data:any)
{  
  return this.http.post<any>(`${this.dotnetapi}/Attendance/FetchCompReq_Filter_HR`,data);
}

Filter_FetchRegularizationReq_HR(data:any)
{  
  return this.http.post<any>(`${this.dotnetapi}/Attendance/Filter_FetchRegularizationReq_HR`,data);
}
FetchPendingCount_HR(reqtype:any,empcode:any)
{  
  return this.http.get<any>(`${this.dotnetapi}/LeaveManagement/FetchPendingCount_HR/${reqtype}/${empcode}`);
}


Filter_FetchOTHistory_HR(data:any)
{  
  return this.http.post<any>(`${this.dotnetapi}/Attendance/Filter_FetchOTHistory_HR`,data);
}

Filter_FetchLeaveRequests_HR(data:any)
{  
  return this.http.post<any>(`${this.dotnetapi}/LeaveManagement/Filter_FetchLeaveRequests_HR`,data);
}


Filter_FetchCompoff_LeaveRequests_HR(data:any)
{  
  return this.http.post<any>(`${this.dotnetapi}/LeaveManagement/Filter_FetchCompoff_LeaveRequests_HR`,data);
}

Filter_FetchBusinessTrip_HR(data:any)
{  
  return this.http.post<any>(`${this.dotnetapi}/LeaveManagement/Filter_FetchBusinessTrip_HR`,data);
}

Filter_FetchPermissionRequest_HR(data:any)
{  
  return this.http.post<any>(`${this.dotnetapi}/LeaveManagement/Filter_FetchPermissionRequest_HR`,data);
}

Filter_FetchExpenseClaim_HR(data:any)
{  
  return this.http.post<any>(`${this.dotnetapi}/Payroll/Filter_FetchExpenseClaim_HR`,data);
}

Filter_FetchLoanRequests_HR(data:any)
{  
  return this.http.post<any>(`${this.dotnetapi}/Payroll/Filter_FetchLoanRequests_HR`,data);
}
ApproveRejectRequest_HR(data:any)
{  
  return this.http.post<any>(`${this.dotnetapi}/LeaveManagement/ApproveRejectRequest_HR`,data);
}
CancelRequest_HR(data:any)
{  
  return this.http.post<any>(`${this.dotnetapi}/LeaveManagement/CancelRequest_HR`,data);
}

addfamilydetails(famdtl:any)
{
  //alert(JSON.stringify(famdtl));
  return this.http.post<any>(`${this.dotnetapi}/EmployeeManagement/AddFamilyDetails`,famdtl);
}

addfamilysts(famsts:any)
{
  //alert(JSON.stringify(famsts));
  return this.http.post<any>(`${this.dotnetapi}/EmployeeManagement/AddFamilyStatus`,famsts);
}

listfamdtl(employee_code:any)
{
  return this.http.get<any>(`${this.dotnetapi}/EmployeeManagement/FetchFamilyDetails/${employee_code}`); 
}

Editfamdetails(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/EmployeeManagement/UpdateFamilyDetails`,data);
}

FetchCompanyList(empcode:any)
{
  return this.http.get<any>(`${this.dotnetapi}/MasterManagement/FetchCompanyList/${empcode}`);
}

FetchResouceList(empcode:any)
{
  return this.http.get<any>(`${this.dotnetapi}/MasterManagement/FetchResorceList/${empcode}`);
}

listCompanyList(comtypeid:any)
{
  return this.http.get<any>(`${this.dotnetapi}/MasterManagement/MasterComboData/${comtypeid}`);
}

FetchDepartmentList(company:any,empcode:any)
{
  return this.http.get<any>(`${this.dotnetapi}/MasterManagement/DepartmentCombo_Company_User_Wise/${company}/${empcode}`);
}
// Fetch Employee List
FetchEmployeeList(department:any,company:any,empcode:any)
{
  return this.http.get<any>(`${this.dotnetapi}/MasterManagement/EmployeefilterComboData_User/${department}/${company}/${empcode}`);
}

// fetch side menus
FetchMenus(groupID:any){
  return this.http.get<any>(`${this.dotnetapi}/MasterManagement/FetchMenuAccess/${groupID}`);
}


FetchCompanyLeavePolicy(company:any)
{
  return this.http.get<any>(`${this.dotnetapi}/LeaveManagement/FetchLeavePolicy/${company}`);
}
FetchEmployeeAnnualLeave(company:any,leave:any)
{
  return this.http.get<any>(`${this.dotnetapi}/LeaveManagement/FetchAnnualLeave_Emp/${company}/${leave}`);
}
FetchFirstandLastofYear()
{
  return this.http.get<any>(`${this.dotnetapi}/MasterManagement/Fetch_FirstLastDateOfYear`);
}
FetchYearEndProcessingHistory(user:any)
{
  return this.http.get<any>(`${this.dotnetapi}/LeaveManagement/Fetch_YearEndLeaveProcessingHistory/${user}`);
}
YearEndProcessingHistoryFilter(user:any,company:any,year:any,status:any)
{
  return this.http.get<any>(`${this.dotnetapi}/LeaveManagement/Fetch_YearEndLeaveProcessingHistory_Filter/${user}/${company}/${year}/${status}`);
}
YearEndLeaveProcessing(user:any,company:any,year:any)
{
  return this.http.get<any>(`${this.dotnetapi}/LeaveManagement/Fetch_YearEndLeaveProcessing/${user}/${company}/${year}`);
}
StartLeaveProcessing(user:any,company:any,year:any)
{
  return this.http.get<any>(`${this.dotnetapi}/LeaveManagement/LeaveYearEndProcess/${user}/${company}/${year}`);
}
//Holiday Settings
FetchCurrentholidays(company:any,level:any,year:any)
{
  return this.http.get<any>(`${this.dotnetapi}/Attendance/FetchCurrentholidays/${company}/${level}/${year}`);
}
AddHolidayCalendar(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/Attendance/AddHolidayCalendar`,data);
}
FetchHolidayYear()
{
  return this.http.get<any>(`${this.dotnetapi}/Attendance/FetchHolidayYear`);
}
SaveYearEndLeaveProcessing(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/LeaveManagement/Save_YearEndLeaveProcessing`,data);
}

listfamsts(empcode:any)
{
 // alert(empcode);
  return this.http.get<any>(`${this.dotnetapi}/EmployeeManagement/FetchFamilyStatus/${empcode}`);
}

//Disciplinary Warnings
SaveDisciplinaryWarnings(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/Payroll/SaveDisciplinaryWarnings`,data);
}
FetchDisciplinaryWarnings(company:any,status:any,empcode:any)
{
  return this.http.get<any>(`${this.dotnetapi}/Payroll/FetchDisciplinaryWarnings/${company}/${status}/${empcode}`); 
}
UpdateDisciplinaryWarnings(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/Payroll/UpdateDisciplinaryWarnings`,data);
}
DeleteDisciplinaryWarnings(warningid:any, empcode:any)
{
  return this.http.get<any>(`${this.dotnetapi}/Payroll/DeleteDisciplinaryWarnings/${warningid}/${empcode}`);
}
//Display All Months
DisplayAllMonths()
{
  return this.http.get<any>(`${this.dotnetapi}/MasterManagement/DisplayAllMonths`);
}

listAllfamilydetails(employee_code:any)
{
  return this.http.get<any>(`${this.dotnetapi}/EmployeeManagement/FetchFamilyDetails/${employee_code}`); 
}

listAllfamilysts(employee_code:any)
{
  return this.http.get<any>(`${this.dotnetapi}/EmployeeManagement/FetchFamilyAllStatus/${employee_code}`);
}
UpdateLeaves(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/LeaveManagement/UpdateLeaves`,data);
}
//Medical Insurance
FetchMedicalInsurance(empcode:any)
{
  return this.http.get<any>(`${this.dotnetapi}/EmployeeManagement/FetchMedicalInsurance/${empcode}`);
}
// employee personal details
FetchPersonalDetails(empcode:any)
{
  return this.http.get<any>(`${this.dotnetapi}/EmployeeManagement/FetchEmployeePersonalDtl/${empcode}`);
}

deactivate_resetLogin(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/EmployeeManagement/deactivate_resetLogin`,data);
}
//Service Document requests
AddServiceDocReq(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/EmployeeManagement/AddServiceDocReq`,data);
}
FetchDocumentRequests_Team(employee_code:any,reqstatus:any,company:any,desig:any)
{
  return this.http.get<any>(`${this.dotnetapi}/EmployeeManagement/FetchDocumentRequests_Team/${employee_code}/${reqstatus}/${company}/${desig}`);
}
FetchDocumentRequests_Personal(employee_code:any,reqstatus:any,doctype:any)
{
  return this.http.get<any>(`${this.dotnetapi}/EmployeeManagement/FetchDocumentRequests_Personal/${employee_code}/${reqstatus}/${doctype}`);
}
ApproveRejectDocumentRequest(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/EmployeeManagement/ApproveRejectDocumentRequest`,data);
}
CancelDocumentRequest(reqId:any,empcode:any)
{  
  return this.http.get<any>(`${this.dotnetapi}/EmployeeManagement/CancelDocumentRequest/${reqId}/${empcode}`);
}
DocumentRequestDocUpload(data:any,reqid:any)
{
  return this.http.post<any>(`${this.dotnetapi}/File/DocumentRequestDocUpload/${reqid}`,data);
}
GetDocumentRequestDocs(reqId:any)
{  
 // alert(reqId)
  return this.http.get<any>(`${this.dotnetapi}/File/GetDocumentRequestDocs/${reqId}`);
}
//Leave settings
GetPermittedLeaves(empcode:any)
{
  return this.http.get<any>(`${this.dotnetapi}/LeaveManagement/GetpermittedLeave/${empcode}`);
}
FetchTypeofLeaves()
{
  return this.http.get<any>(`${this.dotnetapi}/LeaveManagement/FetchLeaveTypes`);
}
deleteleavepolicies(deleteData:any)
{
  return this.http.post<any>(`${this.dotnetapi}/LeaveManagement/DeleteLeavePolicies`,deleteData);
}
SaveNewPolicy(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/LeaveManagement/Save_NewLeavePolicy`,data);
}

// dashboard
FetchDashboardDetails(company:any,empcode:any)
{
  return this.http.get<any>(`${this.dotnetapi}/ReportDashboard/Fetch_Employee_Dashboards/${company}/${empcode}`);
}
// Notifications
NotViewedNotificationCount(empcode:any)
{
  return this.http.get<any>(`${this.dotnetapi}/ReportDashboard/NotViewedNotificationCount/${empcode}`);
}
MarkAsViewed_Notifications(emp_code:any,flag:any)
{
  return this.http.get<any>(`${this.dotnetapi}/ReportDashboard/MarkAsViewed_Notifications/${emp_code}/${flag}`);
}
FetchAllNotification(empcode:any)
{
  return this.http.get<any>(`${this.dotnetapi}/ReportDashboard/Fetch_ViewAllNotifications/${empcode}`);
}
//Medical Insurance
ViewInsuranceDocuments(keyid:any,file:any)
{
  let urls=`${this.dotnetapi}/File/GetInsuranceDocument/${keyid}/${file}`;
   return urls;
}
//Fetch Leave company wise
FetchLeaveTypes_CompanyWise(empcode:any)
{
  return this.http.get<any>(`${this.dotnetapi}/LeaveManagement/FetchLeaveTypes_CompanyWise/${empcode}`);
}



// Checklist

runChecklist(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/Payroll/RunCheckllist`,data);
}

listchecklistdetails(company:any,monthname:any)
{
  return this.http.get<any>(`${this.dotnetapi}/Payroll/FetchPrePayrollCheckList/${company}/${monthname}`);
}

// My Payroll - salary stucture


fetch_salary_struct(empcode:any)
{
 return this.http.get<any>(`${this.dotnetapi}/Payroll/FetchSalaryStrAllowance/${empcode}`);
}

fetch_salary_rev_history(empcode:any)
{
  return this.http.get<any>(`${this.dotnetapi}/Payroll/FetchSalaryRevHistory/${empcode}`);
}

fetch_payslipData(empcode:any,paymonth:any)
{
  return this.http.get<any>(`${this.dotnetapi}/Payroll/FetchPayslipDetails/${empcode}/${paymonth}`);
}

fetch_payslipDatafilter(empcode:any,paymonth:any)
{
  return this.http.get<any>(`${this.dotnetapi}/Payroll/FetchPayslipDetails/${empcode}/${paymonth}`);
}

genCompanyData(company:any)
{
  return this.http.get<any>(`${this.dotnetapi}/Payroll/GetCompanyData/${company}`);
}


fetch_annual_earnings(empcode:any,year:any)
{
  return this.http.get<any>(`${this.dotnetapi}/Payroll/Getanual_earnings/${empcode}/${year}`); 
}


//Salary processing
FetchSalaryReport(company:any, month:any,empcode:any,grpname:any,desig:any)
{
  return this.http.get<any>(`${this.dotnetapi}/Payroll/FetchSalaryReport/${company}/${month}/${empcode}/${grpname}/${desig}`);
}
FetchSalarySpiltUp(operation:any,month:any,empcode:any)
{
  return this.http.get<any>(`${this.dotnetapi}/Payroll/FetchSalarySpiltUp/${operation}/${month}/${empcode}`);
}
FetchSalarySpiltUp_EditReport(operation:any,month:any,empcode:any)
{
  return this.http.get<any>(`${this.dotnetapi}/Payroll/FetchSalarySpiltUp_EditReport/${operation}/${month}/${empcode}`);
}
UpdateSalaryReport(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/Payroll/SalaryReportUpdate`,data);
}
Salary_Processing(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/Payroll/Salary_Processing`,data);
}
FetchSalaryProcessingList(company:any, month:any,empcode:any)
{
  return this.http.get<any>(`${this.dotnetapi}/Payroll/FetchSalaryProcessingList/${company}/${month}/${empcode}`);
}
SalaryProcessing_ApprovalReject(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/Payroll/SalaryProcessing_ApprovalReject`,data);
}
EmployeefilterComboData_Payroll(comp:any,User:any,groupname:any,design:any)
{
  return this.http.get<any>(`${this.dotnetapi}/Payroll/EmployeefilterComboData_Payroll/${comp}/${User}/${groupname}/${design}`);
}
//Payroll Attendance report
FetchPayrollAttendanceDetails(payrollmonth:any,year:any,company:any)
{
  return this.http.get<any>(`${this.dotnetapi}/ReportDashboard/FetchPayrollAttendanceDetails/${payrollmonth}/${year}/${company}`);
}
//Monthly salary review report
FetchMonthlySalaryReviewReport(company:any,payrollmonth:any,year:any,empcode:any)
{
  return this.http.get<any>(`${this.dotnetapi}/ReportDashboard/FetchMonthlySalaryReviewReport/${company}/${payrollmonth}/${year}/${empcode}`);
}
//Bonus Payroll report
FetchBonusPayrollReport(year:any)
{
  return this.http.get<any>(`${this.dotnetapi}/ReportDashboard/FetchBonusPayrollReport/${year}`);
}
//Loan report
FetchLoanReport(company:any,status:any,payment_start_date:any)
{
  
  return this.http.get<any>(`${this.dotnetapi}/ReportDashboard/FetchLoanReport/${company}/${status}/${payment_start_date}`);
}
//Additions and deductions

SaveAdditionDeduction_OneTime(data:any)
{ 
    return this.http.post<any>(`${this.dotnetapi}/Payroll/SaveAdditionDeduction_OneTime`,data);
}
FetchAdditionDeduction(addDeduct:any,repeat:any,user:any,month:any,year:any)
{
  return this.http.get<any>(`${this.dotnetapi}/Payroll/FetchAdditionDeduction/${addDeduct}/${repeat}/${user}/${month}/${year}`);
}
SaveAdditionDeduction_Repeated(data:any)
{ 
    return this.http.post<any>(`${this.dotnetapi}/Payroll/SaveAdditionDeduction_Repeated`,data);
}
EditAdditionDeduction_Repeated(data:any)
{ 
    return this.http.post<any>(`${this.dotnetapi}/Payroll/EditAdditionDeduction_Repeated`,data);
}
fetchonloadcheckList(company:any,month:any)
{
  return this.http.get<any>(`${this.dotnetapi}/Payroll/PayrollChecklistData/${company}/${month}`); 
}

DisplayloadMonth(company:any)
{
  return this.http.get<any>(`${this.dotnetapi}/Payroll/ChecklistNextPayrollMonth/${company}`); 
}

//HR Policies
AddHRPolicies(data:any)
{ 
    return this.http.post<any>(`${this.dotnetapi}/EmployeeManagement/AddHRPolicies`,data);
}
FetchHRPolicies(empcode:any,company:any,grpname:any,mflag:any)
{
  return this.http.get<any>(`${this.dotnetapi}/EmployeeManagement/FetchHRPolicies/${empcode}/${company}/${grpname}/${mflag}`);
}
HRPolicyDocUpload(data:any,policyid:any)
{ 
    return this.http.post<any>(`${this.dotnetapi}/File/HRPolicyDocUpload/${policyid}`,data);
}
GetHRPolicyDocs(policyid:any)
{
  let urls=`${this.dotnetapi}/File/GetHRPolicyDocs/${policyid}`;
   return urls;
}
//Fetch Leave Details For Airticket
FetchLeaveDetails(fromdate:any,todate:any,empcode:any,selectedemp:any)
{
  return this.http.get<any>(`${this.dotnetapi}/LeaveManagement/FetchLeaveDetails/${fromdate}/${todate}/${empcode}/${selectedemp}`);
}

CashSalaryReport(empcode:any,year:any,month:any,company:string)
{  
  return this.http.get<any>(`${this.dotnetapi}/ReportDashboard/CashSalaryReport/${empcode}/${year}/${month}/${company}`);
}
//Bonus Payout History REport
GetBonusHistoryReportData(company:any,fromyear:any,toyear:any)
{
  return this.http.get<any>(`${this.dotnetapi}/ReportDashboard/GetBonusHistoryReportData/${company}/${fromyear}/${toyear}`);
}
ExportToExcelBonusHistoryReport(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/File/WriteExcelFileBonusHistoryReport`,data);
}

//Announcements
AddAnnouoncements(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/ReportDashboard/AddAnnouoncements`,data);
}
//Fetch Announcements
FetchAnnouncement(empcode:any,company:any,status:any)
{
  return this.http.get<any>(`${this.dotnetapi}/ReportDashboard/FetchAnnouncementSummary/${empcode}/${company}/${status}`);
}

//Send Mail - Leave
SendEMail(type:any,empcode:any,empname:any,leavetype:any,fromdt:any,todt:any)
{
  return this.http.get<any>(`${this.dotnetapi}/LeaveManagement/SendEMail/${type}/${empcode}/${empname}/${leavetype}/${fromdt}/${todt}`);
}

//Generate Report
FetchPayment_Reports_Summary(empcode:any,month:any,year:any)
{
  return this.http.get<any>(`${this.dotnetapi}/Payroll/FetchPayment_Reports_Summary/${empcode}/${month}/${year}`);
}
GeneratePayment(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/Payroll/GeneratePayment`,data);
}
Get_WPS_File(company:any,month:any,bank:any,report_type:any,paytype:any)
{
  return this.http.get<any>(`${this.dotnetapi}/File/Get_WPS_File/${company}/${month}/${bank}/${report_type}/${paytype}`);
}
//Master data management
FetchMasterData()
{
  return this.http.get<any>(`${this.dotnetapi}/MasterManagement/FetchMasterData`);
}
AddMasterData(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/MasterManagement/MasterDataManagement`,data);
}
GetMasterData(typeid:any)
{
  return this.http.get<any>(`${this.dotnetapi}/MasterManagement/GetMasterData/${typeid}`);
}
CompanyLogoUpload(filesup:any,companycode:any)
{ 
  return this.http.post<any>(`${this.dotnetapi}/File/CompanyLogoUpload/${companycode}`,filesup);
}
MedicalInsuranceDocUpload(filesup:any,keyid:any)
{  
  return this.http.post<any>(`${this.dotnetapi}/File/MedicalInsuranceDocUpload/${keyid}`,filesup);
}
GetMedicalInsuranceDocName(keyid: any, filetype: any) {
  return this.http.get(`${this.dotnetapi}/EmployeeManagement/GetMedicalInsuranceDocName/${keyid}/${filetype}`,{responseType: 'text'});
}

viewBussinessReqPersonal(emp_code:any,reqid:any)
{
  return this.http.get<any>(`${this.dotnetapi}/LeaveManagement/ViewEditBusinessTripRequest/${emp_code}/${reqid}`); 
}
AddBussinessTripRequestEdit(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/LeaveManagement/EditBusinessTripRequest`,data);
}
fetchBusinesstripViewtoAdminInLoad(emp_code:any,reqstatus:any,fromdate:any,todate:any)
{
  return this.http.get<any>(`${this.dotnetapi}/LeaveManagement/FetchBusinessTrip_Admin/${emp_code}/${reqstatus}/${fromdate}/${todate}`);
}
fetchdataForAdmin(emp_code:any,reqid:any,status:any)
{
  return this.http.get<any>(`${this.dotnetapi}/LeaveManagement/ViewApprovedBTRequest_Admin/${emp_code}/${reqid}/${status}`);
}

AddBussinessTripverification(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/LeaveManagement/AddOrUpdate_BTDocuments`,data);
}

UploadBusinesstripdoc(filesup:any,doctype:any,ecode:any,upflag:any)
{
  return this.http.post<any>(`${this.dotnetapi}/File/BusinessTripDocUpload/${doctype}/${ecode}/${upflag}`,filesup);
}

GetBusinestripDocs(fname:any,reqid:any,upflag:any)
{
  // alert(fname)
  // alert(reqid)
  // alert(upflag)

  let urls=`${this.dotnetapi}/File/GetBusinestripDocs/${fname}/${reqid}/${upflag}`;
  //alert(urls)
  return urls;
}

//Request mngmnt

RequestmngmntOnload(empcode:any){  
  return this.http.get<any>(`${this.dotnetapi}/LeaveManagement/BT_ReqMgnt_HR/${empcode}`);
}

RequestmngmntOnloadfilter(data:any){  
  return this.http.post<any>(`${this.dotnetapi}/LeaveManagement/BT_ReqMgnt_FilterHR`,data);
}
//Employee master Report
FetchMasterReportData(tabid:any)
{
  return this.http.get<any>(`${this.dotnetapi}/EmployeeManagement/FetchMasterReportData/${tabid}`);
}
WriteExcelFileEmployeeMasterReport(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/File/WriteExcelFileEmployeeMasterReport`,data);
}
GetExcelEmployeeMasterReport(docname:any)
{
  let urls=`${this.dotnetapi}/File/GetExcelEmployeeMasterReport/${docname}`;
   return urls;
}
FetchEmployee(dept:any,company:any,user:any)
{
  return this.http.get<any>(`${this.dotnetapi}/MasterManagement/EmployeefilterComboData_MultipleEmployee/${dept}/${company}/${user}`);
}

//Airticket cost report
FetchAirticketsCostReport(empcode:any,company:any,fromdate:any,todate:any)
{ 
  return this.http.get<any>(`${this.dotnetapi}/ReportDashboard/FetchAirticketsCostReport/${empcode}/${company}/${fromdate}/${todate}`);
}

//Announcemnets
FetchAnniversaryorBirthdayWishes()
{ 
  return this.http.get<any>(`${this.dotnetapi}/ReportDashboard/FetchAnniversaryorBirthdayWishes`);
}
UpdateAnniversaryorBirthdayWishes(msg:any,typeid:any,empcode:any)
{ 
  return this.http.get<any>(`${this.dotnetapi}/ReportDashboard/UpdateAnniversaryorBirthdayWishes/${msg}/${typeid}/${empcode}`);
}

// directory

fetchcompanyaccess(empcode:any)
{
  return this.http.get<any>(`${this.dotnetapi}/MasterManagement/FetchCompanies/${empcode}`);
}
//Change Reporting Manager
UpdateReportingManager(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/EmployeeManagement/UpdateReportingManager`,data);
}
//fetch company
FetchCompanyName(empcode:any){
  return this.http.get<any>(`${this.dotnetapi}/MasterManagement/FetchCompanyName/${empcode}`);
}

// loan revicement

Loan_RevisePaymentTerms(data:any){  
  return this.http.post<any>(`${this.dotnetapi}/Payroll/Loan_RevisePaymentTerms`,data);
}

restrictsalaryupdate(empcode:any)
{
  return this.http.get<any>(`${this.dotnetapi}/EmployeeManagement/RestrictSalaryUpdateFromProfile/${empcode}`);
}

//VP Approval-Training
FetchTrainingSubjects()
{
  return this.http.get<any>(`${this.dotnetapi}/LMS/FetchTrainingSubjects`);
}
FetchTrainingPlan_FilterVP(empcode:any, reqstatus:any, year:any, company:any)
{
  return this.http.get<any>(`${this.dotnetapi}/LMS/FetchTrainingPlan_FilterVP/${empcode}/${reqstatus}/${year}/${company}`);
}
SaveTrainingRequest(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/LMS/SaveTrainingRequest`,data);
}
ApproveTrainingPlanbyVP(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/LMS/ApproveTrainingPlanbyVP`,data);
}
HoldOrCancel_Training_HR(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/LMS/HoldOrCancel_Training_HR`,data);
}
Release_Training(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/LMS/Release_Training`,data);
}
ViewTrainingDetails(trainingid:any)
{
  return this.http.get<any>(`${this.dotnetapi}/LMS/ViewTrainingDetails/${trainingid}`);
}
//Attendance Register
FetchMarkAttendanceTraining(trainingid:any)
{
  
  return this.http.get<any>(`${this.dotnetapi}/LMS/FetchMarkAttendanceTraining/${trainingid}`);
}
AddTrainingAttendance(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/LMS/AddTrainingAttendance`,data);
}

CheckHafzaleave(empcode:any,month:any,flag:any)
{
  return this.http.get<any>(`${this.dotnetapi}/LeaveManagement/CheckHafzaleave/${empcode}/${month}/${flag}`);
}

WriteExcelFileMonthlyAttendance(month:any,year:any,company:any,empcode:any)
{
  return this.http.get<any>(`${this.dotnetapi}/File/WriteExcelFileMonthlyAttendance/${month}/${year}/${company}/${empcode}`);
}

// Training management
FetchTrainingRequest(empcode:any,reqstatus:any,viewflag:any,year:any)
{ 
  return this.http.get<any>(`${this.dotnetapi}/LMS/FetchTrainingRequest/${empcode}/${reqstatus}/${viewflag}/${year}`);
}
ApproveRejectEdit_trainingRequestByHOD(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/LMS/ApproveRejectEdit_trainingRequestByHOD`,data);
}
EmployeeUpcomingTraining(empcode:any)
{
  return this.http.get<any>(`${this.dotnetapi}/LMS/EmployeeUpcomingTraining/${empcode}`);
}
ViewUpcomingTrainingDetails(trainingID:any)
{
  return this.http.get<any>(`${this.dotnetapi}/LMS/EmployeeUpcomingTraining/${trainingID}`);
}
GetTrainingDetails(trainingid:any)
{
  return this.http.get<any>(`${this.dotnetapi}/LMS/GetTrainingDetails/${trainingid}`);
}
FetchTrainingEmpEffectiveness_LM(empcode:any,status:any)
{
  return this.http.get<any>(`${this.dotnetapi}/LMS/FetchTrainingEmpEffectiveness_LM/${empcode}/${status}`);
}
Fetch_MyTraining_Details(empcode:any,status:any,year:any)
{
  return this.http.get<any>(`${this.dotnetapi}/LMS/Fetch_MyTraining_Details/${empcode}/${status}/${year}`);
}
GetTrainingCertificate(trainingID:any,empcode:any)
{
  let urls=`${this.dotnetapi}/File/GetTrainingCertificate/${trainingID}/${empcode}`;
   return urls;
}
FetchProviderTrainings(empcode:any,year:any,status:any)
{
  return this.http.get<any>(`${this.dotnetapi}/LMS/FetchProviderTrainings/${empcode}/${year}/${status}`);
}
Generate_Trainingmatrix(empcode:any,loginid:any,company:any,event:any)
{
  return this.http.get<any>(`${this.dotnetapi}/File/Generate_Trainingmatrix/${empcode}/${loginid}/${company}/${event}`);
}


//EFFECTIVENESS FEEDBACK FORM
AddEmpEffectiveForm(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/LMS/AddEmpEffectiveForm`,data);
}
AddEmpFeedback(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/LMS/AddEmpFeedback`,data);
}
ViewEmpEffectivenessDetails(trainingID:any,empcode:any)
{
  return this.http.get<any>(`${this.dotnetapi}/LMS/ViewEmpEffectivenessDetails/${trainingID}/${empcode}`);
}
CheckTrainingProvider(empcode:any)
{
  return this.http.get<any>(`${this.dotnetapi}/LMS/CheckTrainingProvider/${empcode}`);
}

//Laya - training plan


ProvidersComboData()
{
  return this.http.get<any>(`${this.dotnetapi}/LMS/ProvidersComboData`);
}

Listingtrainingplans(empcode:any){ 
  return this.http.get<any>(`${this.dotnetapi}/LMS/FetchTrainingReqList_HR/${empcode}`);
}

Listingtrainingplansfilter(data:any){  
  return this.http.post<any>(`${this.dotnetapi}/LMS/FetchTrainingReq_FilterHR`,data);
}


Listscheduledtrainingplans(empcode:any){ 
  return this.http.get<any>(`${this.dotnetapi}/LMS/FetchScheduledPlanList_HR/${empcode}`);
}

ListScheduledPlanList_FilterHR(data:any){  
  return this.http.post<any>(`${this.dotnetapi}/LMS/FetchScheduledPlanList_FilterHR`,data);
}

editproposedData(data:any){  
  return this.http.post<any>(`${this.dotnetapi}/LMS/Update_Training_HR`,data);
}

holdproposedData(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/LMS/HoldOrCancel_Training_HR`,data);
}

releaseplanData(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/LMS/Release_Training`,data);
}

rejectproposedData(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/LMS/HoldOrCancel_Training_HR`,data);
}

sendtoVP(data:any)
{
  //alert(data)
  return this.http.post<any>(`${this.dotnetapi}/LMS/GenerateTrainingPlanbyHR`,data);
}

editscheduledData(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/LMS/AddRemove_TrainingEmployees_HR`,data);
}

fetchScheduledEmployee(trainingId:any){ 
  return this.http.get<any>(`${this.dotnetapi}/LMS/FetchEmployeesList_scheduled/${trainingId}`);
}

fetchScheduledDatas(trainingId:any){ 
  return this.http.get<any>(`${this.dotnetapi}/LMS/Fetch_ScheduledPlan_Details/${trainingId}`);
}

Update_ScheduledTraining(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/LMS/Update_ScheduledTraining_HR`,data);
}


// add assessment 

// GetTrainingDetails(trainingid:any)
// {
//   return this.http.get<any>(`${this.dotnetapi}/LMS/GetTrainingDetails/${trainingid}`);
// }

AddAssessmentDtls(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/LMS/AddAssessmentDetails`,data);
}

fetchassessmentdetails(training_id:any)
{
  return this.http.get<any>(`${this.dotnetapi}/LMS/FetchAssessmentByTraining/${training_id}`);
}

Getquestions(assessment_id:any)
{

  return this.http.get<any>(`${this.dotnetapi}/LMS/FetchAssessmentQuestions/${assessment_id}`);
}

AddAssessmentQuest(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/LMS/AddAssessmentQuestions`,data);
}


// upload certificate 

fetchcertificateDetails(trainingid:any)
{
  return this.http.get<any>(`${this.dotnetapi}/LMS/GetEmployeefor_Certificate/${trainingid}`);
}

uploadcertificatdtl(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/LMS/Update_trainingCert`,data);
}

UploadTrainingCertificate(filesup:any,trainingid:any,emp_code:any)
{

  return this.http.post<any>(`${this.dotnetapi}/File/UploadTrainingCert/${emp_code}/${trainingid}`,filesup);

}


GetTrainingCertificates(trainingid:any,docname:any,empcode:any)
{
  let urls=`${this.dotnetapi}/File/GetTrainingCerts/${trainingid}/${docname}/${empcode}`;
  //alert(urls)
  return urls;
}

// take assessment

GetEmpAssessment_Details(trainingid:any,empcode:any)
{
  return this.http.get<any>(`${this.dotnetapi}/LMS/GetEmpAssessment_Details/${trainingid}/${empcode}`);
}

GetTrainingQuestions(trainingid:any)
{
  return this.http.get<any>(`${this.dotnetapi}/LMS/FetchAssessment_questionnaire/${trainingid}`);
}

// save assessment

Saveassessmentqts(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/LMS/Add_EmpAssessment`,data);
}


fetchOnlineTrainings(empcode:any,year:any,company:any)
{
  return this.http.get<any>(`${this.dotnetapi}/LMS/Fetch_OnlineTraining_List/${empcode}/${year}/${company}`);
}
fetchOnlineTrainingsfilter(empcode:any,year:any,company:any)
{
  return this.http.get<any>(`${this.dotnetapi}/LMS/Fetch_OnlineTraining_List/${empcode}/${year}/${company}`);
}

cancelTraining(req_id:any,emp_code:any)
{
  return this.http.get<any>(`${this.dotnetapi}/LMS/Cancel_OnlineTraining_HR/${req_id}/${emp_code}`);
}

SaveOnlineTrainingRequest(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/LMS/Add_OnlineTraining`,data);
}

UploadOnlineVideos(filesup:any,trainingid:any)
{
  //alert(doctype)
  return this.http.post<any>(`${this.dotnetapi}/File/Online_training_DocUpload/${trainingid}`,filesup);

}

addnewTrainingnm(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/LMS/Add_NewSubject_Online`,data);
}

fetchexistingtrdetails(area:any,subject:any)
{
  return this.http.get<any>(`${this.dotnetapi}/LMS/Fetch_OnlineTraining_docs/${area}/${subject}`);
}

fetchtraining_status_rpt(empcode:any,year:any,status:any,company:any)
{
  return this.http.get<any>(`${this.dotnetapi}/LMS/FetchTrainingStatusReport/${empcode}/${year}/${status}/${company}`);
}
//course FEEDBACK view-HR

Fetch_Feedback_StatusCount(trainingid:any)
{
  //alert(trainingid)
  return this.http.get<any>(`${this.dotnetapi}/LMS/Fetch_Feedback_StatusCount/${trainingid}`);
}
Fetch_Feedback_DetailsFilter(trainingid:any,status:any)
{
  //alert(trainingid)
  return this.http.get<any>(`${this.dotnetapi}/LMS/Fetch_Feedback_DetailsFilter/${trainingid}/${status}`);
}
Fetch_Effectiveness_StatusCount(trainingid:any)
{
  //alert(trainingid)
  return this.http.get<any>(`${this.dotnetapi}/LMS/Fetch_Effectiveness_StatusCount/${trainingid}`);
}
Fetch_Effectiveness_DetailsFilter(trainingid:any,status:any)
{
  //alert(trainingid)
  return this.http.get<any>(`${this.dotnetapi}/LMS/Fetch_Effectiveness_DetailsFilter/${trainingid}/${status}`);
}
WriteExcelFileFeedbackEffectiveness(trainingid:any,category:any)
{
  //alert(trainingid)
  return this.http.get<any>(`${this.dotnetapi}/File/WriteExcelFileFeedbackEffectiveness/${trainingid}/${category}`);
}
GetExcelFeedbackEffectivenessData(filename:any)
{
  //alert(trainingid)
  return this.http.get<any>(`${this.dotnetapi}/File/GetExcelFeedbackEffectivenessData/${filename}`);
}
//Training Master Report
FetchTrainingMasterReportData(company:any,year:any)
{
  //alert(trainingid)
  return this.http.get<any>(`${this.dotnetapi}/LMS/FetchTrainingMasterReportData/${company}/${year}`);
}
//Competency Master
DesignationCombo_Company_Dept_Wise(dept:any,user:any)
{
  //alert(trainingid)
  return this.http.get<any>(`${this.dotnetapi}/MasterManagement/DesignationCombo_Company_Dept_Wise/${dept}/${user}`);
}
FetchCompetency(company:any,dept:any,desig:any,skill_category:any)
{
  //alert(desig)
  return this.http.get<any>(`${this.dotnetapi}/Competency/FetchCompetency/${company}/${dept}/${desig}/${skill_category}`);
}
AddCompetency(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/Competency/AddCompetency`,data);
}
DeleteCompetency(compid:any)
{
  //alert(compid)
  return this.http.get<number>(`${this.dotnetapi}/Competency/DeleteCompetency/${compid}`);
}

Combo_TrainingProvidersapi(trainingid:any)
{
  return this.http.get<any>(`${this.dotnetapi}/LMS/Combo_TrainingProviders/${trainingid}`);
}

//competency
Fetch_CompetencyEvaluationReq_LM(user:any,status:any,year:any)
{
  return this.http.get<any>(`${this.dotnetapi}/Competency/Fetch_CompetencyEvaluationReq_LM/${user}/${status}/${year}`);
}
Fetch_CompetencyEvaluationReq_LM_StatusCount(user:any)
{
  return this.http.get<any>(`${this.dotnetapi}/Competency/Fetch_CompetencyEvaluationReq_LM_StatusCount/${user}`);
}
WriteExcelFileCompetency(user:any)
{
  // alert('api')
  return this.http.get<any>(`${this.dotnetapi}/File/WriteExcelFileCompetency/${user}`);
}
UploadCompetency(data:any,user:any)
{
  return this.http.post<any>(`${this.dotnetapi}/File/UploadCompetency/${user}`,data);
}
//Competency Assessment-Manager
FetchCompetencyActualLevel(company:any,dept:any,desig:any,skill_category:any,req_id:any,empcode:any)
{
  return this.http.get<any>(`${this.dotnetapi}/Competency/FetchCompetencyActualLevel/${company}/${dept}/${desig}/${skill_category}/${req_id}/${empcode}`);
}
FetchTrainingRequiredCompetency(company:any,dept:any,desig:any)
{
  //alert(desig)
  return this.http.get<any>(`${this.dotnetapi}/Competency/FetchTrainingRequiredCompetency/${company}/${dept}/${desig}`);
}
AddCompetencyEvaluation(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/Competency/AddCompetencyEvaluation`,data);
}

SaveEvaluationRequest(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/Competency/CompetencyRequest_HR`,data);
}


fetchevaluationdata(empcode:any,reqstatus:any,year:any,company:any)
{
  return this.http.get<any>(`${this.dotnetapi}/Competency/FetchCompetency_ReqFilterHR/${empcode}/${reqstatus}/${year}/${company}`);
}

cancelEvRquest(empcode:any,reqid:any)
{
  return this.http.get<any>(`${this.dotnetapi}/Competency/Cancel_Competency_HR/${empcode}/${reqid}`);
}

Generate_skillmatrix(department:any,desination:any,year:any,employee:any,empcode:any,comcode:any)
{
  return this.http.get<any>(`${this.dotnetapi}/File/Generate_Competancymatrix/${department}/${desination}/${year}/${employee}/${empcode}/${comcode}`);
}
Update_Online_CompleteStatus(empcode:any,trainingid:any)
{
  return this.http.get<number>(`${this.dotnetapi}/LMS/Update_Online_CompleteStatus/${empcode}/${trainingid}`);
}
Update_VideoWatched_Time(empcode:any,trainingid:any,watchtime:any)
{
  return this.http.get<number>(`${this.dotnetapi}/LMS/Update_VideoWatched_Time/${empcode}/${trainingid}/${watchtime}`);
}
GetTrainingDocs(training_id:any,filename:any)
{
  let urls=`${this.dotnetapi}/File/GetOnline_TrainingDocs/${training_id}/${filename}`;
  return urls;
}

//salary revision report
Fetch_Salary_Revision_Report(company:any,empcode:any)
{
  return this.http.get<number>(`${this.dotnetapi}/ReportDashboard/Fetch_Salary_Revision_Report/${company}/${empcode}`);
}


//competency training linking
FetchSkillGapEmployees(companycode:any,competency:any)
{
  return this.http.get<number>(`${this.dotnetapi}/LMS/FetchSkillGapEmployees/${companycode}/${competency}`);
}
FetchTrainigReqSkills(companycode:any)
{
  return this.http.get<number>(`${this.dotnetapi}/LMS/FetchTrainigReqSkills/${companycode}`);
}
Fetch_TrainingEmployeeList(trainingId:any)
{
  return this.http.get<number>(`${this.dotnetapi}/LMS/Fetch_TrainingEmployeeList/${trainingId}`);
}
//Resignation request by employee
Fetch_ResignationReqEmp(empcode:any)
{
  //alert(desig)
  return this.http.get<any>(`${this.dotnetapi}/OffBoarding/Fetch_ResignationReqEmp/${empcode}`);
}
Add_ResignationReq(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/OffBoarding/Add_ResignationReq`,data);
}
Fetch_AssetDetails_Emp(empcode:any,category:any)
{
  //alert(desig)
  return this.http.get<any>(`${this.dotnetapi}/OffBoarding/Fetch_AssetDetails_Emp/${empcode}/${category}`);
}
Fetch_Resignation_AccountsDtl(empcode:any)
{
  //alert(desig)
  return this.http.get<any>(`${this.dotnetapi}/OffBoarding/Fetch_Resignation_AccountsDtl/${empcode}`);
}

//Resignation Approval
Fetch_ResignationReq_team(empcode:any,reqstatus:any,year:any)
{
  // alert(reqstatus)
  // alert(year)
  // alert(empcode)
  return this.http.get<any>(`${this.dotnetapi}/OffBoarding/Fetch_ResignationReq_team/${empcode}/${reqstatus}/${year}`);
}
ApproveReject_Resignation(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/OffBoarding/ApproveReject_Resignation`,data);
}
//Experience Letter
Fetch_ResgExperienceTemplate(empcode:any)
{
  //alert(desig)
  return this.http.get<any>(`${this.dotnetapi}/OffBoarding/Fetch_ResgExperienceTemplate/${empcode}`);
}
//Resignation Approval HR
EmpLastWorkingDate(empcode:any)
{
  //alert(desig)
  return this.http.get<any>(`${this.dotnetapi}/OffBoarding/EmpLastWorkingDate/${empcode}`);
}
AddTerminationReqByHR(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/OffBoarding/AddTerminationReqByHR`,data);
}
Fetch_OffboardingReq_HR(empcode:any,reqstatus:any,year:any,company:any)
{
  // alert(reqstatus)
  // alert(year)
  // alert(empcode)
  return this.http.get<any>(`${this.dotnetapi}/OffBoarding/Fetch_OffboardingReq_HR/${empcode}/${reqstatus}/${year}/${company}`);
}
Fetch_Employment_Cert_Template(empcode:any,reqid:any)
{
  return this.http.get<any>(`${this.dotnetapi}/EmployeeManagement/Employment_Cert_Template/${empcode}/${reqid}`);
}
//Salary_Transfer_Cert_Template
Fetch_Salary_Transfer_Cert_Template(empcode:any,reqid:any)
{
  return this.http.get<any>(`${this.dotnetapi}/EmployeeManagement/Salary_Transfer_Cert_Template/${empcode}/${reqid}`);  
}
Fetch_Salary_Cert_Template(empcode:any,reqid:any)
{
  return this.http.get<any>(`${this.dotnetapi}/EmployeeManagement/Salary_Cert_Template/${empcode}/${reqid}`);  
}

//Family Airticket 
FetchFamilyAirTicketDetails(flag:any,status:any,year:any,type:any,user:any)
{
  return this.http.get<any>(`${this.dotnetapi}/EmployeeManagement/FetchFamilyAirTicketDetails/${flag}/${status}/${year}/${type}/${user}`);
}
ViewFamilyAirTicketDetails(reqid:any,empcode:any)
{
  return this.http.get<any>(`${this.dotnetapi}/EmployeeManagement/ViewFamilyAirTicketDetails/${reqid}/${empcode}`);
}
AddFamilyAirticketDetails(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/EmployeeManagement/AddFamilyAirticketDetails`,data);
}
CancelFamilyTicketRequest(reqid:any,empcode:any)
{
  return this.http.get<any>(`${this.dotnetapi}/EmployeeManagement/CancelFamilyTicketRequest/${reqid}/${empcode}`);
}
ApproveFamilyAirticketDetails(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/EmployeeManagement/ApproveFamilyAirticketDetails`,data);
}
RemoveMembersFamilyAirTicket(reqid:any,memberID:any)
{
  return this.http.get<any>(`${this.dotnetapi}/EmployeeManagement/RemoveMembersFamilyAirTicket/${reqid}/${memberID}`);
}
FamilyAirTicketAccess(empcode:any)
{
  return this.http.get<any>(`${this.dotnetapi}/EmployeeManagement/FamilyAirTicketAccess/${empcode}`);
}
fetch_Grievance_Report(empcode:any,reqstatus:any,year:any,company:any)
{
  return this.http.get<any>(`${this.dotnetapi}/ReportDashboard/GrievanceLog_Report/${empcode}/${reqstatus}/${year}/${company}`);
}
//Complaints/Suggestions
Add_Grievance_Request(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/EmployeeManagement/Add_Grievance_Request`,data);
}
FetchGrievance_RequestsList(empcode:any,reqstatus:any,viewflag:any,year:any,grpname:any)
{
  
  return this.http.get<any>(`${this.dotnetapi}/EmployeeManagement/FetchGrievance_RequestsList/${empcode}/${reqstatus}/${viewflag}/${year}/${grpname}`);
}
Grievance_Review(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/EmployeeManagement/Grievance_Review`,data);
}
ResourceEmployeesComboData(dept:any,company:any,user:any,viewflag:any)
{
 
  return this.http.get<any>(`${this.dotnetapi}/MasterManagement/ResourceEmployeesComboData/${dept}/${company}/${user}/${viewflag}`);
}

//Eos
Fetch_EOSProcessList(user:any,company:any,year:any,status:any)
{
  return this.http.get<number>(`${this.dotnetapi}/OffBoarding/Fetch_EOSProcessList/${user}/${company}/${year}/${status}`);
}
Add_AccountsClearance(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/OffBoarding/Add_AccountsClearance`,data);
}
EOS_Processing(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/OffBoarding/EOS_Processing`,data);
}
AddOrDeduct_EOSPayments(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/OffBoarding/AddOrDeduct_EOSPayments`,data);
}
FetchEOSDataofEmployee(empcode:any)
{
  return this.http.get<any>(`${this.dotnetapi}/OffBoarding/FetchEOSDataofEmployee/${empcode}`);
}
EOS_SalaryApprovalReject(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/OffBoarding/EOS_SalaryApprovalReject`,data);
}
FetchEOS_EmpSal_Details(empcode:any)
{
  return this.http.get<any>(`${this.dotnetapi}/OffBoarding/FetchEOS_EmpSal_Details/${empcode}`);
}
FetchEOS_AdditionDeduction_Details(empcode:any)
{
  return this.http.get<any>(`${this.dotnetapi}/OffBoarding/FetchEOS_AdditionDeduction_Details/${empcode}`);
}
EOS_DetailsEdit(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/OffBoarding/EOS_DetailsEdit`,data);
}

Fetch_ResgAcceptanceTemplate(empcode:any)
{
  return this.http.get<number>(`${this.dotnetapi}/OffBoarding/Fetch_ResgAcceptanceTemplate/${empcode}`);
}
Fetch_EmpDetails_ExitInterview(empcode:any,reqid:any)
{
  return this.http.get<number>(`${this.dotnetapi}/OffBoarding/Fetch_EmpDetails_ExitInterview/${empcode}/${reqid}`);
}
AddEmp_ExitInterviewForm(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/OffBoarding/AddEmp_ExitInterviewForm`,data);
}
View_ExitInterviewDetails(empcode:any)
{
  return this.http.get<number>(`${this.dotnetapi}/OffBoarding/View_ExitInterviewDetails/${empcode}`);
}

listOffboardingdtls(empcode:any,status:any, year:any, company:any, category:any)
{
  return this.http.get<any>(`${this.dotnetapi}/OffBoarding/Fetch_ITAdminClearanceList/${empcode}/${status}/${year}/${company}/${category}`);
}


fetchtraining_eos_rpt(company:any, fromdate:any, todate:any)
{
  return this.http.get<any>(`${this.dotnetapi}/Competency/EOS_Report/${company}/${fromdate}/${todate}`);
}

ListAssetsOffboardingaction(empcode:any, category:any, assetsts:any)
{
  return this.http.get<any>(`${this.dotnetapi}/OffBoarding/Fetch_EmpAssetDetails_ITAdmin/${empcode}/${category}/${assetsts}`);
}


addoffboardingActions(data:any)
{
  //alert(JSON.stringify(data))
  return this.http.post<any>(`${this.dotnetapi}/OffBoarding/Add_AssetClearance_ITAdmin`,data);
}

ListAssetsOffboardingactionview(empcode:any, category:any, reqid:any)
{
  return this.http.get<any>(`${this.dotnetapi}/OffBoarding/View_EmpAssetDetails/${empcode}/${category}/${reqid}`);
}
//Hiring Center
Add_NewHire_request(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/Hiring/Add_NewHire_request`,data);
}
Fetch_HireRequest(empcode:any,reqstatus:any,year:any,mflag:any)
{  
  return this.http.get<any>(`${this.dotnetapi}/Hiring/Fetch_HireRequest/${empcode}/${reqstatus}/${year}/${mflag}`);
}
ViewJob_Description(reqId:any)
{
  return this.http.get<any>(`${this.dotnetapi}/Hiring/ViewJob_Description/${reqId}`);
}
ApproveReject_HiringRequest(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/Hiring/ApproveReject_HiringRequest`,data);
}
//Offer Details
AddSalaryDtlsOfferLetter(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/Hiring/AddSalaryDtlsOfferLetter`,data);
}
AddCandidateOfferDetails(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/Hiring/AddCandidateOfferDetails`,data);
}
Fetch_CandidateOfferDtls(candidateID:any)
{  
  return this.http.get<any>(`${this.dotnetapi}/Hiring/Fetch_CandidateOfferDtls/${candidateID}`);
}
Fetch_hiring_salarydtl(candidateID:any)
{  
  return this.http.get<any>(`${this.dotnetapi}/Hiring/Fetch_hiring_salarydtl/${candidateID}`);
}
GenerateOfferLetter(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/Hiring/GenerateOfferLetter`,data);
}

//Training approver details - New
Fetch_EmpApprover_Training(empcode:any,reqid:any)
{
  return this.http.get<any>(`${this.dotnetapi}/LMS/Fetch_EmpApprover_Training/${empcode}/${reqid}`);
}

//Hiring
Get_eligible_openings(years:any)
{
  return this.http.get<any>(`${this.dotnetapi}/Hiring/Get_eligible_openings/${years}`);
}
Apply_for_job(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/Hiring/Apply_for_job`,data);
}
Get_applied_jobs(year:any,company:any,status:any,ecode:any)
{
  return this.http.get<any>(`${this.dotnetapi}/Hiring/Get_applied_jobs/${year}/${company}/${status}/${ecode}`);
}
Job_CV_upload(data:any,reqid:any)
{
  return this.http.post<any>(`${this.dotnetapi}/File/Job_CV_upload/${reqid}`,data);
}

//Hiring  Management
JobRequest_ListHR(empcode:any,reqstatus:any,year:any,company:any)
{
  return this.http.get<any>(`${this.dotnetapi}/Hiring/JobRequest_ListHR/${empcode}/${reqstatus}/${year}/${company}`);
}
HireRequest_StatusCount(empcode:any)
{
  return this.http.get<any>(`${this.dotnetapi}/Hiring/HireRequest_StatusCount/${empcode}`);
}
FetchApplicantsList(reqId:any,designation:any,user:any)
{
  return this.http.get<any>(`${this.dotnetapi}/Hiring/FetchApplicantsList/${reqId}/${designation}/${user}`);
}
GetCandidateCV(activereqid:any,flag:any)
{
  let urls=`${this.dotnetapi}/File/GetCandidateCV/${activereqid}/${flag}`;
   return urls;
}
Hiring_Updates(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/Hiring/Hiring_Updates`,data);
}
CandidateNameCombo(reqid:any)
{
  return this.http.get<any>(`${this.dotnetapi}/Hiring/CandidateNameCombo/${reqid}`);
}
HR_CandidateDocUpload(data:any,reqid:any)
{
  return this.http.post<any>(`${this.dotnetapi}/File/HR_CandidateDocUpload/${reqid}`,data);
}
HR_AddCandidateDetails(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/Hiring/HR_AddCandidateDetails`,data);
}
HireRequestCandidates(reqid:any)
{
  return this.http.get<any>(`${this.dotnetapi}/Hiring/HireRequestCandidates/${reqid}`);
}
HR_EditCandidateDetails(reqid:any,candid:any)
{
  return this.http.get<any>(`${this.dotnetapi}/Hiring/HR_EditCandidateDetails/${reqid}/${candid}`);
}
Candidate_ListHR(user:any,reqstatus:any,company:any)
{
  return this.http.get<any>(`${this.dotnetapi}/Hiring/Candidate_ListHR/${user}/${reqstatus}/${company}`);
}
Update_OfferAccept_Details(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/Hiring/Update_OfferAccept_Details`,data);
}
ConvertToEmployee_HR(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/Hiring/ConvertToEmployee_HR`,data);
}
Save_Employee_Transfer(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/Hiring/Save_Employee_Transfer`,data);
}
//Anjana 21-05-2024
viewTurnoverReport(company:any,startmonth:any,endmonth:any,startyr:any,endyr:any)
{
  return this.http.get<any>(`${this.dotnetapi}/ReportDashboard/FetchturnoverReport/${company}/${startmonth}/${endmonth}/${startyr}/${endyr}`);
}

Fetch_EffectiveDate_SalRevision(company:any)
{
  return this.http.get<any>(`${this.dotnetapi}/Payroll/Fetch_EffectiveDate_SalRevision/${company}`); 
}
//Candidate Evaluation
  FetchCandidateDetails(candidate_id:any)
  {
    return this.http.get<any>(`${this.dotnetapi}/Hiring/Fetch_Candidate_Details/${candidate_id}`);
  } 
  SaveCandidateDetails(data:any)
  {
    
    return this.http.post<any>(`${this.dotnetapi}/Hiring/AddCandidate_EvaluationDtl`,data);
  }
  ViewCandidateDetails(candidate_id:any)
  {
    return this.http.get<any>(`${this.dotnetapi}/Hiring/ViewCandidate_EvaluationDtl/${candidate_id}`);
  } 
//Accounts_Payable
AccountsExpenseClaimFilter(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/Payroll/FetchAccountsExpenseClaim_Filter`,data);
} 
AccountsLoanFilter(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/Payroll/FetchAccountsLoanRequest_Filter`,data);
} 
GetAccountsExpenseclaimFile(reqid:any,docname:any)
{
let urls=`${this.dotnetapi}/File/GetAccountsExpenseClaimDocs/${reqid}/${docname}`;
 return urls;
}
AccountsLoanPaymentDetails(empcode:any,reqid:any)
{
  return this.http.get<any>(`${this.dotnetapi}/Payroll/Fetch_AccountsLoanPaymentDetails/${empcode}/${reqid}`);
}

fetchofferletterdtlsApi(candidateid:any)
{
  //alert(candidateid);
  return this.http.get<any>(`${this.dotnetapi}/Hiring/Fetch_offer_letter_data/${candidateid}`);
}

fetchsalarydtlsApi(candidateid:any)
{
  //alert(candidateid);
  return this.http.get<any>(`${this.dotnetapi}/Hiring/Fetch_hiring_salarydtl/${candidateid}`);
}
FetchCompanyList_Resource(empcode:any)
{
  return this.http.get<any>(`${this.dotnetapi}/MasterManagement/FetchCompanyList_Resource/${empcode}`);
}


Fetch_TrainingTarget_HR(type:any,company:any)  
{
  return this.http.get<any>(`${this.dotnetapi}/LMS/Fetch_TrainingTarget_HR/${type}/${company}`);
}

SaveOnlineTrainingTarget(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/LMS/Update_TrainingTarget`,data);
}


SaveCostDetails(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/LMS/Add_TrainingCost`,data);
}

Fetch_Trainingcost(trainingid:any)
{
  return this.http.get<any>(`${this.dotnetapi}/LMS/Fetch_TrainingCost/${trainingid}`);
}


//salary revision history report
Fetch_Salary_Revision_History_Report(user:any,company:any,fromyear:any,toyear:any)
{
  return this.http.get<number>(`${this.dotnetapi}/ReportDashboard/FetchSalaryRevisionHistory/${user}/${company}/${fromyear}/${toyear}`);
}

//Goal Settings and analytics-HR
Employees_ForGoalAssign(company:any,user:any)
{   
  return this.http.get<any>(`${this.dotnetapi}/PerformanceManagement/Employees_ForGoalAssign/${company}/${user}`);
}
GoalSetting_ListHR(user:any,reqstatus:any,year:any,company:any,mflag:any)
{   
  return this.http.get<any>(`${this.dotnetapi}/PerformanceManagement/GoalSetting_ListHR/${user}/${reqstatus}/${year}/${company}/${mflag}`);
}
Add_GoalSetting_RequestHR(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/PerformanceManagement/Add_GoalSetting_RequestHR`,data);
}
Update_ReviewOrTargetDate_HR(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/PerformanceManagement/Update_ReviewOrTargetDate_HR`,data);
}
Goal_Status_LogDetails(empcode:any,reqid:any)
{   
  return this.http.get<any>(`${this.dotnetapi}/PerformanceManagement/Goal_Status_LogDetails/${empcode}/${reqid}`);
}
Goal_Details_Emp(empcode:any,reqid:any)
{   
  return this.http.get<any>(`${this.dotnetapi}/PerformanceManagement/Goal_Details_Emp/${empcode}/${reqid}`);
}
UploadGoal_BulkData(data:any,user:any)
{
  return this.http.post<any>(`${this.dotnetapi}/File/UploadGoal_BulkData/${user}`,data);
}
PerformanceAnalytics_ListHR(user:any,dept:any,year:any,company:any)
{   
  return this.http.get<any>(`${this.dotnetapi}/PerformanceManagement/PerformanceAnalytics_ListHR/${user}/${dept}/${year}/${company}`);
}

//Performance Management
Fetch_EmpGoalRequest(empcode:any,year:any)
{
  return this.http.get<any>(`${this.dotnetapi}/PerformanceManagement/Fetch_EmpGoalRequest/${empcode}/${year}`);
}
EmpGoalApproveReject(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/PerformanceManagement/EmpGoalApproveReject`,data);
}
Fetch_EmpGoalRequestsLM(user:any,year:any,status:any)
{
  return this.http.get<any>(`${this.dotnetapi}/PerformanceManagement/Fetch_EmpGoalRequestsLM/${user}/${year}/${status}`);
}
GoalSettingByLM(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/PerformanceManagement/GoalSettingByLM`,data);
}
Fetch_GoalDetails(user:any,year:any,reqid:any)
{
  return this.http.get<any>(`${this.dotnetapi}/PerformanceManagement/Fetch_GoalDetails/${user}/${year}/${reqid}`);
}
Fetch_EmpGoalDetails(user:any,year:any)
{
  return this.http.get<any>(`${this.dotnetapi}/PerformanceManagement/Fetch_EmpGoalDetails/${user}/${year}`);
}
RemoveEmpGoal(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/PerformanceManagement/RemoveEmpGoal`,data);
}

//AssetReports
ViewAssestReports(company:any,emp_code:any)
{
return this.http.get<any>(`${this.dotnetapi}/ReportDashboard/AssestReportData/${company}/${emp_code}`);
}

//DocumentReports
ViewDocumentReports(comp:any,empcode:any)
{
return this.http.get<any>(`${this.dotnetapi}/ReportDashboard/DocumentReport/${comp}/${empcode}`);
}

//Employee Insurance Reports
ViewInsuranceReports(comp:any,empcode:any)
{
return this.http.get<any>(`${this.dotnetapi}/ReportDashboard/EmployeeInsuranceReport/${comp}/${empcode}`);
}

goalassessmentdetails(empcode:any,reqid:any)
{
  return this.http.get<any>(`${this.dotnetapi}/PerformanceManagement/Goal_AssessmentDetails_List/${empcode}/${reqid}`);
}

goalpogressdetails(empcode:any,reqid:any,goalid:any)
{
  return this.http.get<any>(`${this.dotnetapi}/PerformanceManagement/Goal_ProgressDetails/${empcode}/${reqid}/${goalid}`);
}

updateProgresstrack(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/PerformanceManagement/Update_GoalProgress_EmpOrLM`,data);
}

updateassessmenttrack(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/PerformanceManagement/Add_GoalAssessment_EmpOrLM`,data);
}

appraisalFormdata(empcode:any,reqid:any)
{
  return this.http.get<any>(`${this.dotnetapi}/PerformanceManagement/ViewAppraisal_Form/${empcode}/${reqid}`);
}

appRejGoalEvaluation(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/PerformanceManagement/ApproveReject_GoalEvaluation_HR`,data);
}
fetch_EOS_Report(company:any,fromdate:any,todate:any,empcode:any)
{
  return this.http.get<any>(`${this.dotnetapi}/ReportDashboard/EOS_Report/${company}/${fromdate}/${todate}/${empcode}`);
}

//employee-transfer-promotion
FetchLineManagers(company:any)
{
  return this.http.get<any>(`${this.dotnetapi}/Hiring/FetchLineManagers/${company}`);
}
Add_EmpTransferPromotion_Details(data:any)
{
  return this.http.post<any>(`${this.dotnetapi}/Hiring/Add_EmpTransferPromotion_Details`,data);
}
EmpTransferPromotion_Details(id:any)
{
  return this.http.get<any>(`${this.dotnetapi}/Hiring/EmpTransferPromotion_Details/${id}`);
}
EmpTransferPromotion_ActionHistory(user:any,designation:any,company:any,year:any)
{
  return this.http.get<any>(`${this.dotnetapi}/Hiring/EmpTransferPromotion_ActionHistory/${user}/${company}/${designation}/${year}`);
}
EmpTransferPromotion_SalDetails(id:any)
{
  return this.http.get<any>(`${this.dotnetapi}/Hiring/EmpTransferPromotion_SalDetails/${id}`);
}

}
