import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShiftassignmentComponent } from './attendance/shiftassignment/shiftassignment.component';
import { LoginComponent } from './login/login.component';
import { DashboardHrComponent } from './dashboards/dashboard-hr/dashboard-hr.component';
import { OvertimereportComponent } from './reports/overtimereport/overtimereport.component';
import { TimetrackingComponent } from './dashboards/timetracking/timetracking.component';
import { ViewbiometricdataComponent } from './attendance/viewbiometricdata/viewbiometricdata.component';
import { ReportsandsheetsComponent } from './reports/reportsandsheets/reportsandsheets.component';
import { AttendanceregularizationHrComponent } from './attendance/attendanceregularization-hr/attendanceregularization-hr.component';
import { CancellationreqComponent } from './attendance/cancellationreq/cancellationreq.component';
import { AttendancefinalizationComponent } from './attendance/attendancefinalization/attendancefinalization.component';
import { RegularizationComponent } from './attendance/regularization/regularization.component';
import { CompensationComponent } from './attendance/compensation/compensation.component';
import { OvertimeComponent } from './attendance/overtime/overtime.component';
import { FileuploadingComponent } from './attendance/fileuploading/fileuploading.component';
import { EarlylateCheckinCheckoutreportComponent } from './reports/earlylate-checkin-checkoutreport/earlylate-checkin-checkoutreport.component';
import { MonthlyAttendanceReportComponent } from './reports/monthly-attendance-report/monthly-attendance-report.component';
import { DailyAttendanceReportComponent } from './reports/daily-attendance-report/daily-attendance-report.component';
import { ManhoursReportComponent } from './reports/manhours-report/manhours-report.component';
import { LeaveHistoryReportComponent } from './reports/leave-history-report/leave-history-report.component';
import { LeaveManagementComponent } from './leave/leave-management/leave-management.component';
import { CompoffComponent } from './leave/compoff/compoff.component';
import { BusinesstripComponent } from './leave/businesstrip/businesstrip.component';
import { PermissionsComponent } from './leave/permissions/permissions.component';
import { ApprovelevelsettingComponent } from './approvelevelsetting/approvelevelsetting.component';
import { DashboardEmpComponent } from './dashboards/dashboard-emp/dashboard-emp.component';
import { AttendancedataComponent } from './attendance/attendancedata/attendancedata.component';
import { BiometricDataComponent } from './attendance/biometric-data/biometric-data.component';
import { ProccessedAttendanceComponent } from './attendance/proccessed-attendance/proccessed-attendance.component';
import { YearlyleaveReportComponent } from './reports/yearlyleave-report/yearlyleave-report.component';
import { EmployeeprofileviewComponent } from './employee/employeeprofileview/employeeprofileview.component';
import { EmployeeprofileComponent } from './employee/employeeprofile/employeeprofile.component';
import { EmployeedirectoryComponent } from './employee/employeedirectory/employeedirectory.component';
import { EmployeedirectoryviewComponent } from './employee/employeedirectoryview/employeedirectoryview.component';
import { EditemployeeprofileComponent } from './employee/editemployeeprofile/editemployeeprofile.component';
import { ExpenseClaimComponent } from './payroll/expense-claim/expense-claim.component';
import { LoanComponent } from './payroll/loan/loan.component';
import { LoanManagementComponent } from './payroll/loan-management/loan-management.component';
import { BonusAllowanceComponent } from './payroll/bonusallowance/bonusallowance.component';
import { SalaryRevisionComponent } from './payroll/salary-revision/salary-revision.component';
import { SubContractorTimesheetComponent } from './reports/subcontractortimesheet/subcontractortimesheet.component';
import { LeavemanagementComponent } from './leave/leavemanagement/leavemanagement.component';
import { AirticketApproveComponent } from './leave/airticket-booking/airticket-booking.component';
import { LeaveledgerComponent } from './reports/leaveledger/leaveledger.component';
import { AnnualleaveplannerComponent } from './leave/annualleaveplanner/annualleaveplanner.component';
import { ViewAnnualleaveplannerComponent } from './leave/view-annualleaveplanner/view-annualleaveplanner.component';
import { RequestManagementComponent } from './employee/requestmanagement/requestmanagement.component';
import { RegularizationHRComponent } from './employee/regularization-hr/regularization-hr.component';
import { Overtime_HRComponent } from './employee/overtime-hr/overtime-hr.component';
import { LeaveHRComponent } from './employee/leave-hr/leave-hr.component';
import { CompoffHRComponent } from './employee/compoff-hr/compoff-hr.component';
import { BustripHRComponent } from './employee/bustrip-hr/bustrip-hr.component';
import { PermissionsHRComponent } from './employee/permissions-hr/permissions-hr.component';
import { LoanHRComponent } from './employee/loan-hr/loan-hr.component';
import { ExpenseHRComponent } from './employee/expense-hr/expense-hr.component';
import { LeavesettingsComponent } from './leave/leavesettings/leavesettings.component';
import { YearendleaveprocessingComponent } from './leave/yearendleaveprocessing/yearendleaveprocessing.component';
import { HolidaysettingsComponent } from './employee/holidaysettings/holidaysettings.component';
import { DisciplinaryWarningsComponent } from './payroll/disciplinary-warnings/disciplinary-warnings.component';
import { DocumentRequestComponent } from './ServiceRequests/document-request/document-request.component';
import { ViewshiftComponent } from './attendance/viewshift/viewshift.component';
import { MedicalInsuranceComponent } from './employee/medical-insurance/medical-insurance.component';
import { PrePayrollchecklistComponent } from './payroll/pre-payrollchecklist/pre-payrollchecklist.component';
import { SalaryDetailsComponent } from './payroll/salary-details/salary-details.component';
import { PayslipComponent } from './payroll/payslip/payslip.component';
import { SalaryProcessingComponent } from './payroll/salary-processing/salary-processing.component';
import { SalaryReportComponent } from './payroll/salary-report/salary-report.component';
import { EditSalaryReportComponent } from './payroll/edit-salary-report/edit-salary-report.component';
import { PayrollAttendanceReportComponent } from './reports/payroll-attendance-report/payroll-attendance-report.component';
import { MonthlySalaryReviewReportComponent } from './reports/monthly-salary-review-report/monthly-salary-review-report.component';
import { BonusPayrollReportComponent } from './reports/bonus-payroll-report/bonus-payroll-report.component';
import { LoanReportComponent } from './reports/loan-report/loan-report.component';
import { AdditionsNdeductionsComponent } from './payroll/additions-ndeductions/additions-ndeductions.component';
import { EmpProfileLimitedviewComponent } from './employee/emp-profile-limitedview/emp-profile-limitedview.component';
import { EmpProfileLimitededitComponent } from './employee/emp-profile-limitededit/emp-profile-limitededit.component';
import { HRPoliciesComponent } from './employee/hrpolicies/hrpolicies.component';
import { CashSalaryReportComponent } from './reports/cash-salary-report/cash-salary-report.component';
import { BonusPayoutHistoryReportComponent } from './reports/bonus-payout-history-report/bonus-payout-history-report.component';
import { AnnouncementComponent } from './announcement/announcement.component';
import { GeneratePaymentComponent } from './payroll/generate-payment/generate-payment.component';
import { MasterDataManagementComponent } from './master-data-management/master-data-management.component';
import { BusinessTripRequestComponent } from './leave/business-trip-request/business-trip-request.component';
import { BusinessTripRequestAdminComponent } from './leave/business-trip-request-admin/business-trip-request-admin.component';
import { EmployeeMasterReportComponent } from './employee/employee-master-report/employee-master-report.component';
import { AirticketCostReportComponent } from './reports/airticket-cost-report/airticket-cost-report.component';
import { ChangeReportingManagerComponent } from './employee/change-reporting-manager/change-reporting-manager.component';
import { VPApprovalTrainingsComponent } from './LMS/vpapproval-trainings/vpapproval-trainings.component';
import { AttendanceRegisterComponent } from './LMS/attendance-register/attendance-register.component';
import { TrainingRequestsComponent } from './LMS/training-requests/training-requests.component';
import { MytrainingsComponent } from './LMS/mytrainings/mytrainings.component';
import { CourseFeedbackFormComponent } from './LMS/course-feedback-form/course-feedback-form.component';
import { CourseEffectivenessFeedbackComponent } from './LMS/course-effectiveness-feedback/course-effectiveness-feedback.component';
import { CourseEffectivenessComponent } from './LMS/course-effectiveness/course-effectiveness.component';
import { TrainingProviderComponent } from './LMS/training-provider/training-provider.component';

import { TrainingPlanComponent } from './LMS/training-plan/training-plan.component';
import { AddAssessmentComponent } from './LMS/add-assessment/add-assessment.component';
import { AddQuestionnaireComponent } from './LMS/add-questionnaire/add-questionnaire.component';
import { CertificateUploadComponent } from './LMS/certificate-upload/certificate-upload.component';
import { OrganizationChartComponent } from './employee/organization-chart/organization-chart.component';
import { TakeAssessmentComponent } from './LMS/take-assessment/take-assessment.component';
import { AssessmentQuestionsComponent } from './LMS/assessment-questions/assessment-questions.component';
import { AssessmentFinalComponent } from './LMS/assessment-final/assessment-final.component';
import { TrainingStatusReportComponent } from './reports/training-status-report/training-status-report.component';
import { CoursefeedbackHRComponent } from './LMS/coursefeedback-hr/coursefeedback-hr.component';
import { CourseEffectivenessfeedbackHrComponent } from './LMS/course-effectivenessfeedback-hr/course-effectivenessfeedback-hr.component';
import { TrainingMasterReportComponent } from './LMS/training-master-report/training-master-report.component';
import { CompetencyMasterComponent } from './competency/competency-master/competency-master.component';
import { OnlineTrainingComponent } from './LMS/online-training/online-training.component';
import { TrainingMatrixComponent } from './reports/training-matrix/training-matrix.component';
import { CompetencyAssessmentManagerComponent } from './competency/competency-assessment-manager/competency-assessment-manager.component';
import { CompetencyEvaluationMgrComponent } from './competency/competency-evaluation-mgr/competency-evaluation-mgr.component';
import { EvaluationByHRComponent } from './competency/evaluation-by-hr/evaluation-by-hr.component';
import { ComAssessmentresultByHRComponent } from './competency/com-assessmentresult-by-hr/com-assessmentresult-by-hr.component';
import { EmpSkillMatrixComponent } from './reports/emp-skill-matrix/emp-skill-matrix.component';
import { SalaryRevisionReportComponent } from './reports/salary-revision-report/salary-revision-report.component';
import { ResignationRequestComponent } from './OffBoarding/resignation-request/resignation-request.component';
import { ResignationApprovalComponent } from './OffBoarding/resignation-approval/resignation-approval.component';
import { ResignationApprovalHRComponent } from './OffBoarding/resignation-approval-hr/resignation-approval-hr.component';
import { ExperienceLetterComponent } from './OffBoarding/experience-letter/experience-letter.component';
import { EmploymentCertificateComponent } from './ServiceRequests/employment-certificate/employment-certificate.component';
import { SalaryCertificateComponent } from './ServiceRequests/salary-certificate/salary-certificate.component';
import { SalaryTransferCertificateComponent } from './ServiceRequests/salary-transfer-certificate/salary-transfer-certificate.component';
import { FamilyAirticketComponent } from './ServiceRequests/family-airticket/family-airticket.component';
import { GrievanceLogReportComponent } from './reports/grievance-log-report/grievance-log-report.component';
import { ComplaintsComponent } from './ServiceRequests/complaints/complaints.component';
import { EOSStatementComponent } from './OffBoarding/eosstatement/eosstatement.component';
import { EOSDocumentComponent } from './OffBoarding/eosdocument/eosdocument.component';
import { ResignationAcceptanceLetterComponent } from './OffBoarding/resignation-acceptance-letter/resignation-acceptance-letter.component';
import { ExitinterviewformComponent } from './OffBoarding/exitinterviewform/exitinterviewform.component';
import { EmployeeOffboardingComponent } from './competency/employee-offboarding/employee-offboarding.component';
import { EmployeeOffboardingActionComponent } from './competency/employee-offboarding-action/employee-offboarding-action.component';



const routes: Routes = [
  {path :'' , component:LoginComponent},
  {path :'shiftassignment' , component:ShiftassignmentComponent},
  {path :'dashboardHR' , component:DashboardHrComponent},
  {path :'overtimeReport' , component:OvertimereportComponent},
  {path :'timetracker' , component:TimetrackingComponent},
  {path :'viewbiometricdata' , component:ViewbiometricdataComponent},
  {path :'reportsandtimesheets' , component:ReportsandsheetsComponent},
  {path :'attendanceregularizationHR' , component:AttendanceregularizationHrComponent},
  {path :'cancellationrequest' , component:CancellationreqComponent},
  {path :'attendancefinalization' , component:AttendancefinalizationComponent},
  {path :'regularization' , component:RegularizationComponent},
  {path :'compensation' , component:CompensationComponent},
  {path :'overtime' , component:OvertimeComponent},
  {path :'FileUpload' , component:FileuploadingComponent},
  {path :'EarlyLate_checkin_checkout_reports' , component:EarlylateCheckinCheckoutreportComponent},
  {path :'Monthly_attendance_reports' , component:MonthlyAttendanceReportComponent},
  {path :'Daily_attendance_reports' , component:DailyAttendanceReportComponent},
  {path :'ManHour_reports' , component:ManhoursReportComponent},
  {path :'Leave_History_Report' , component:LeaveHistoryReportComponent},
  {path :'Leave_Management' , component:LeaveManagementComponent},
  {path :'compoff' , component:CompoffComponent},
  {path :'businesstrip' , component:BusinesstripComponent},
  {path :'permissions' , component:PermissionsComponent},
  {path :'app' , component:ApprovelevelsettingComponent},
  {path :'DashboardEmp' , component:DashboardEmpComponent},
  {path :'attendancedata' , component:AttendancedataComponent},
  {path :'BiometricData' , component:BiometricDataComponent},
  {path :'ProccessedAttendance' , component:ProccessedAttendanceComponent},
  {path :'yearlyleave_report',component:YearlyleaveReportComponent},
  {path :'employee_profile',component:EmployeeprofileComponent},
  {path :'employee_profile_view',component:EmployeeprofileviewComponent},
  {path :'emp_profile_view_from_directory',component:EmployeeprofileviewComponent},
  {path :'employee_profile_directory',component:EmployeedirectoryComponent},
  {path :'employee_profile_directory_view',component:EmployeedirectoryviewComponent},
  {path :'edit_employee_profile',component:EditemployeeprofileComponent},
  {path :'expense_claim',component:ExpenseClaimComponent},
  {path :'approval_settings' , component:ApprovelevelsettingComponent},
  {path :'emp_profile_view',component:EmployeeprofileviewComponent},
  {path : 'loan',component:LoanComponent},
  {path : 'loan_management', component : LoanManagementComponent},
  {path : 'bonusAllowance', component : BonusAllowanceComponent},
  {path : 'salary_revision', component : SalaryRevisionComponent},
  {path : 'subcontractortimesheet', component : SubContractorTimesheetComponent},
  {path : 'LeaveManagement', component:LeavemanagementComponent},
  {path : 'Airticket_Booking', component:AirticketApproveComponent},
  {path :'leaveledger',component:LeaveledgerComponent},
  {path : 'Annual_Leave_Planner', component:AnnualleaveplannerComponent},
  {path : 'View_Annal_Leave_Planner', component:ViewAnnualleaveplannerComponent},
  {path : 'reqMgmt' , component:RequestManagementComponent},
  {path :'regularizationHR' , component:RegularizationHRComponent },
  {path :'overtimeHR' , component:Overtime_HRComponent },
  {path :'leaveHR' , component:LeaveHRComponent },
  {path :'compoffHR' , component:CompoffHRComponent },
  {path :'bustripHR' , component:BustripHRComponent },
  {path :'permissionsHR' , component:PermissionsHRComponent },
  {path :'loanHR' , component:LoanHRComponent },
  {path :'expenseHR' , component:ExpenseHRComponent },
  {path :'edit_emp_profile',component:EditemployeeprofileComponent},
  {path:'leavesettings',component:LeavesettingsComponent},
  {path:'yearendleaveprocessing',component:YearendleaveprocessingComponent},
  {path:'holidaysettings',component:HolidaysettingsComponent},
  {path:'disciplinary_warnings',component:DisciplinaryWarningsComponent},
  {path:'documentRequest',component:DocumentRequestComponent},
  {path:'viewshift',component:ViewshiftComponent},
  {path:'medical_insurance',component:MedicalInsuranceComponent},
  {path:'pre_payrollchecklist',component:PrePayrollchecklistComponent},
  {path:'salary_details',component:SalaryDetailsComponent},
  {path:'Generate_Payslip',component:PayslipComponent},
  {path:'salary_processing',component:SalaryProcessingComponent},
  {path:'salary_process',component:SalaryProcessingComponent},
  {path:'salary_report',component:SalaryReportComponent},
  {path:'edit_salary_report',component:EditSalaryReportComponent},
  {path:'payroll-attendance-report',component:PayrollAttendanceReportComponent},
  {path:'monthly-salary-review-report',component:MonthlySalaryReviewReportComponent},
  {path:'bonus-payroll-report',component:BonusPayrollReportComponent},
  {path:'loan-report',component:LoanReportComponent},
  {path:'additions-deductions',component:AdditionsNdeductionsComponent},
  {path:'profile_limited_view',component:EmpProfileLimitedviewComponent},
  {path:'profile_limited_edit',component:EmpProfileLimitededitComponent},
  {path:'HRPolicies',component:HRPoliciesComponent},
  {path:'cashSalaryReport',component:CashSalaryReportComponent},
  {path:'bonus_payout_history_report',component:BonusPayoutHistoryReportComponent},
  {path:'announcement',component:AnnouncementComponent},
  {path:'generate_payment',component:GeneratePaymentComponent},
  {path:'masterdatamgmt',component:MasterDataManagementComponent},
  {path:'business-trip-request' , component:BusinessTripRequestComponent},
  {path:'business-trip-request-admin' , component:BusinessTripRequestAdminComponent},
  {path:'employee-master-report' , component:EmployeeMasterReportComponent},
  {path:'airticket_cost_report',component:AirticketCostReportComponent},
  {path:'change-reporting-manager',component:ChangeReportingManagerComponent},
  {path:'VP-approval-Trainings',component:VPApprovalTrainingsComponent},
  {path:'attendanceRegister',component:AttendanceRegisterComponent},
  {path:'training_request',component:TrainingRequestsComponent},
  {path:'mytrainings',component:MytrainingsComponent},
  {path:'course_feedback_form',component:CourseFeedbackFormComponent},
  {path:'course_effectiveness_feedback',component:CourseEffectivenessFeedbackComponent},
  {path:'course_effectiveness',component:CourseEffectivenessComponent},
  {path:'training_provider',component:TrainingProviderComponent},
  {path:'training_matrix',component:TrainingMatrixComponent},

  {path:'training-plan' , component:TrainingPlanComponent},
  {path:'online-training' , component:OnlineTrainingComponent},
  {path:'add_assessment' , component:AddAssessmentComponent},
  {path:'add_questionnaire' , component:AddQuestionnaireComponent},
  {path:'upload_certificate' , component:CertificateUploadComponent},
  {path:'organization_chart' , component:OrganizationChartComponent},
  {path:'take_assessment' , component:TakeAssessmentComponent},
  {path:'assessment_questions' , component:AssessmentQuestionsComponent},
  {path:'assessment_finalresult' , component:AssessmentFinalComponent},
  {path:'training_status_report' , component:TrainingStatusReportComponent},
  {path:'coursefeedbackHR' , component:CoursefeedbackHRComponent},
  {path:'courseEffectivenessHR' , component:CourseEffectivenessfeedbackHrComponent},
  {path:'TrainingMasterReport' , component:TrainingMasterReportComponent},
  {path:'CompetencyMaster' , component:CompetencyMasterComponent},
  {path:'CompetencyAssessmentManager' , component:CompetencyAssessmentManagerComponent},
  {path:'CompetencyEvaluationManager' , component:CompetencyEvaluationMgrComponent},
  {path:'CompetencyEvaluationbyHR' , component:EvaluationByHRComponent},
  {path:'CompetencyAssessmentresultbyHR' , component:ComAssessmentresultByHRComponent},
  {path:'Emp_skill_matrix' , component:EmpSkillMatrixComponent},
  {path:'salary_revision_report' , component:SalaryRevisionReportComponent},
  {path:'resignationReq' , component:ResignationRequestComponent},
  {path:'resignationApproval' , component:ResignationApprovalComponent},
  {path:'ExperienceLetter' , component:ExperienceLetterComponent},
  {path:'ResignationApprovalHR' , component:ResignationApprovalHRComponent},
  {path:'employment-certificate' , component:EmploymentCertificateComponent},
  {path:'salary-transfer-cerificate' , component:SalaryTransferCertificateComponent},
  {path:'salary-cerificate' , component: SalaryCertificateComponent},
  {path:'family_airticket', component:FamilyAirticketComponent},
  {path:'grievance-log-report' , component:GrievanceLogReportComponent},
  {path:'Complaints' , component:ComplaintsComponent},
  {path:'EOSStatement',component:EOSStatementComponent},
  {path:'EOSDocument',component:EOSDocumentComponent},
  {path:'resignation_acceptance_letter', component:ResignationAcceptanceLetterComponent},
  {path:'exitinterviewform',component:ExitinterviewformComponent},
  {path:'EmployeeOffboarding' , component:EmployeeOffboardingComponent},
  {path:'EmployeeOffboardingAction' , component:EmployeeOffboardingActionComponent},



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
