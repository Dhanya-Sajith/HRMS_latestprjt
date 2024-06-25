import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ShiftassignmentComponent } from './attendance/shiftassignment/shiftassignment.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SidemenuComponent } from './sidemenu/sidemenu.component';
import { LoginComponent } from './login/login.component';
import { DashboardHrComponent } from './dashboards/dashboard-hr/dashboard-hr.component';
import { SearchPipe } from './search.pipe';
import { OvertimereportComponent } from './reports/overtimereport/overtimereport.component';
import { TimetrackingComponent } from './dashboards/timetracking/timetracking.component';
import { ViewbiometricdataComponent } from './attendance/viewbiometricdata/viewbiometricdata.component';
import { ReportsandsheetsComponent } from './reports/reportsandsheets/reportsandsheets.component';
import { AttendanceregularizationHrComponent } from './attendance/attendanceregularization-hr/attendanceregularization-hr.component';
import { CancellationreqComponent } from './attendance/cancellationreq/cancellationreq.component';
import { AttendancefinalizationComponent } from './attendance/attendancefinalization/attendancefinalization.component';
import { DateRangeDirective } from './date-range.directive';
import { RegularizationComponent } from './attendance/regularization/regularization.component';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe} from '@angular/common';
import { CompensationComponent } from './attendance/compensation/compensation.component';
import { OvertimeComponent } from './attendance/overtime/overtime.component';
import { FileuploadingComponent } from './attendance/fileuploading/fileuploading.component';
import { EarlylateCheckinCheckoutreportComponent } from './reports/earlylate-checkin-checkoutreport/earlylate-checkin-checkoutreport.component';
import { MonthlyAttendanceReportComponent } from './reports/monthly-attendance-report/monthly-attendance-report.component';
import { DailyAttendanceReportComponent } from './reports/daily-attendance-report/daily-attendance-report.component';
import { ManhoursReportComponent } from './reports/manhours-report/manhours-report.component';
import { LeaveHistoryReportComponent } from './reports/leave-history-report/leave-history-report.component';
import { LeaveManagementComponent } from './leave/leave-management/leave-management.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { CompoffComponent } from './leave/compoff/compoff.component';
import { BusinesstripComponent } from './leave/businesstrip/businesstrip.component';
import { PermissionsComponent } from './leave/permissions/permissions.component';
import { ApprovelevelsettingComponent } from './approvelevelsetting/approvelevelsetting.component';
import { DashboardEmpComponent } from './dashboards/dashboard-emp/dashboard-emp.component';
import { AttendancedataComponent } from './attendance/attendancedata/attendancedata.component';
import { AnnualleaveplannerComponent } from './leave/annualleaveplanner/annualleaveplanner.component';
import { BiometricDataComponent } from './attendance/biometric-data/biometric-data.component';
import { ProccessedAttendanceComponent } from './attendance/proccessed-attendance/proccessed-attendance.component';
import { YearlyleaveReportComponent } from './reports/yearlyleave-report/yearlyleave-report.component';
import { EmployeedirectoryComponent } from './employee/employeedirectory/employeedirectory.component';
import { EmployeedirectoryviewComponent } from './employee/employeedirectoryview/employeedirectoryview.component';
import { EditemployeeprofileComponent } from './employee/editemployeeprofile/editemployeeprofile.component';
import { EmployeeprofileviewComponent } from './employee/employeeprofileview/employeeprofileview.component';
import { EmployeeprofileComponent } from './employee/employeeprofile/employeeprofile.component';
import { ExpenseClaimComponent } from './payroll/expense-claim/expense-claim.component';
import { PaginationPipe } from './pagination.pipe';
import { LoanComponent } from './payroll/loan/loan.component';
import { LoanManagementComponent } from './payroll/loan-management/loan-management.component';
import { BonusAllowanceComponent } from './payroll/bonusallowance/bonusallowance.component';
import { SalaryRevisionComponent } from './payroll/salary-revision/salary-revision.component';
import { SubContractorTimesheetComponent } from './reports/subcontractortimesheet/subcontractortimesheet.component';
import { LeavemanagementComponent } from './leave/leavemanagement/leavemanagement.component';
import { AirticketApproveComponent } from './leave/airticket-booking/airticket-booking.component';
import { LeaveledgerComponent } from './reports/leaveledger/leaveledger.component';
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
import { NgCircleProgressModule } from 'ng-circle-progress';
import { MedicalInsuranceComponent } from './employee/medical-insurance/medical-insurance.component';
import { PrePayrollchecklistComponent } from './payroll/pre-payrollchecklist/pre-payrollchecklist.component';
import { PayslipComponent } from './payroll/payslip/payslip.component';
import { SalaryDetailsComponent } from './payroll/salary-details/salary-details.component';
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
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
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
import { TrainingProviderComponent } from './LMS/training-provider/training-provider.component';
import { CourseEffectivenessComponent } from './LMS/course-effectiveness/course-effectiveness.component';
import { CourseEffectivenessFeedbackComponent } from './LMS/course-effectiveness-feedback/course-effectiveness-feedback.component';
import { CourseFeedbackFormComponent } from './LMS/course-feedback-form/course-feedback-form.component';
import { MytrainingsComponent } from './LMS/mytrainings/mytrainings.component';
import { TrainingPlanComponent } from './LMS/training-plan/training-plan.component';
import { AddAssessmentComponent } from './LMS/add-assessment/add-assessment.component';
import { AddQuestionnaireComponent } from './LMS/add-questionnaire/add-questionnaire.component';
import { CertificateUploadComponent } from './LMS/certificate-upload/certificate-upload.component';
import { TakeAssessmentComponent } from './LMS/take-assessment/take-assessment.component';
import { AssessmentQuestionsComponent } from './LMS/assessment-questions/assessment-questions.component';
import { AssessmentFinalComponent } from './LMS/assessment-final/assessment-final.component';
import { OrganizationChartComponent } from './employee/organization-chart/organization-chart.component';
import { TrainingStatusReportComponent } from './reports/training-status-report/training-status-report.component';
import { OnlineTrainingComponent } from './LMS/online-training/online-training.component';
import { CoursefeedbackHRComponent } from './LMS/coursefeedback-hr/coursefeedback-hr.component';
import { CourseEffectivenessfeedbackHrComponent } from './LMS/course-effectivenessfeedback-hr/course-effectivenessfeedback-hr.component';
import { TrainingMasterReportComponent } from './LMS/training-master-report/training-master-report.component';
import { CompetencyMasterComponent } from './competency/competency-master/competency-master.component';
import { TrainingMatrixComponent } from './reports/training-matrix/training-matrix.component';
import { CompetencyEvaluationMgrComponent } from './competency/competency-evaluation-mgr/competency-evaluation-mgr.component';
import { CompetencyAssessmentManagerComponent } from './competency/competency-assessment-manager/competency-assessment-manager.component';
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
import { NumberToWordsPipe } from './number-to-words.pipe';
import { EmployeeOffboardingComponent } from './competency/employee-offboarding/employee-offboarding.component';
import { EmployeeOffboardingActionComponent } from './competency/employee-offboarding-action/employee-offboarding-action.component';


@NgModule({
  
  declarations: [
    AppComponent,
    ShiftassignmentComponent,
    HeaderComponent,
    FooterComponent,
    SidemenuComponent,
    LoginComponent,
    DashboardHrComponent,
    SearchPipe,
    OvertimereportComponent,
    TimetrackingComponent,
    ViewbiometricdataComponent,
    ReportsandsheetsComponent,
    AttendanceregularizationHrComponent,
    CancellationreqComponent,
    AttendancefinalizationComponent,
    DateRangeDirective,
    RegularizationComponent,
    CompensationComponent,
    OvertimeComponent,
    FileuploadingComponent,
    EarlylateCheckinCheckoutreportComponent,
    MonthlyAttendanceReportComponent,
    DailyAttendanceReportComponent,
    ManhoursReportComponent,
    LeaveHistoryReportComponent,
    LeaveManagementComponent,
    CompoffComponent,
    BusinesstripComponent,
    PermissionsComponent,
    ApprovelevelsettingComponent,
    DashboardEmpComponent,
    AttendancedataComponent,
    AnnualleaveplannerComponent,
    BiometricDataComponent,
    ProccessedAttendanceComponent,
    YearlyleaveReportComponent,
    EmployeeprofileComponent,
    EmployeeprofileviewComponent,
    EmployeedirectoryComponent,
    EmployeedirectoryviewComponent,
    EditemployeeprofileComponent,
    ExpenseClaimComponent,
    PaginationPipe,
    LoanComponent,
    LoanManagementComponent,
    BonusAllowanceComponent,
    SalaryRevisionComponent,
    SubContractorTimesheetComponent,
    LeavemanagementComponent,
    AirticketApproveComponent,
    LeaveledgerComponent,
    ViewAnnualleaveplannerComponent,
    RequestManagementComponent,
    RegularizationHRComponent,
    Overtime_HRComponent,
    LeaveHRComponent,
    CompoffHRComponent,
    BustripHRComponent,
    PermissionsHRComponent,
    LoanHRComponent,
    ExpenseHRComponent,
    LeavesettingsComponent,
    YearendleaveprocessingComponent,
    HolidaysettingsComponent,
    DisciplinaryWarningsComponent,
    DocumentRequestComponent,
    ViewshiftComponent,
    MedicalInsuranceComponent,
    PrePayrollchecklistComponent,
    PayslipComponent,
    SalaryDetailsComponent,
    SalaryProcessingComponent,
    SalaryReportComponent,
    EditSalaryReportComponent,
    PayrollAttendanceReportComponent,
    MonthlySalaryReviewReportComponent,
    BonusPayrollReportComponent,
    LoanReportComponent,
    AdditionsNdeductionsComponent,
    EmpProfileLimitedviewComponent,
    EmpProfileLimitededitComponent,
    HRPoliciesComponent,
    CashSalaryReportComponent,
    BonusPayoutHistoryReportComponent,
    AnnouncementComponent,
    GeneratePaymentComponent,
    MasterDataManagementComponent,
    BusinessTripRequestComponent,
    BusinessTripRequestAdminComponent,
    EmployeeMasterReportComponent,
    AirticketCostReportComponent,
    ChangeReportingManagerComponent,
    VPApprovalTrainingsComponent,
    AttendanceRegisterComponent,
    TrainingRequestsComponent,
    TrainingProviderComponent,
    CourseEffectivenessComponent,
    CourseEffectivenessFeedbackComponent,
    CourseFeedbackFormComponent,
    MytrainingsComponent,
    TrainingPlanComponent,
    AddAssessmentComponent,
    AddQuestionnaireComponent,
    CertificateUploadComponent,
    TakeAssessmentComponent,
    AssessmentQuestionsComponent,
    AssessmentFinalComponent,
    OrganizationChartComponent,
    TrainingStatusReportComponent,
    OnlineTrainingComponent,
    CoursefeedbackHRComponent,
    CourseEffectivenessfeedbackHrComponent,
    TrainingMasterReportComponent,
    CompetencyMasterComponent,
    TrainingMatrixComponent,
    CompetencyEvaluationMgrComponent,
    CompetencyAssessmentManagerComponent,
    EvaluationByHRComponent,
    ComAssessmentresultByHRComponent,
    EmpSkillMatrixComponent,
    SalaryRevisionReportComponent,
    ResignationRequestComponent,
    ResignationApprovalComponent,
    ResignationApprovalHRComponent,
    ExperienceLetterComponent,
    EmploymentCertificateComponent,
    SalaryCertificateComponent,
    SalaryTransferCertificateComponent,
    FamilyAirticketComponent,
    GrievanceLogReportComponent,
    ComplaintsComponent,
    EOSStatementComponent,
    EOSDocumentComponent,
    ResignationAcceptanceLetterComponent,
    ExitinterviewformComponent,
    NumberToWordsPipe,
    EmployeeOffboardingComponent,
    EmployeeOffboardingActionComponent,
    
    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    DatePipe,
    NgxMaterialTimepickerModule,
    BrowserAnimationsModule,
    NgCircleProgressModule.forRoot({
      "radius": 60,
      "space": -5,
      "outerStrokeGradient": true,
      "outerStrokeWidth": 5,
      "outerStrokeColor": "#4882c2",
      "outerStrokeGradientStopColor": "#53a9ff",
      "innerStrokeColor": "#e7e8ea",
      "innerStrokeWidth": 5,
      "title": "UI",
      "titleFontSize": "12",
      "titleColor": "black",
      "titleFontWeight" : "600",
      "animateTitle": false,
      "animationDuration": 1000,
      "showUnits": false,
      "showBackground": false,
      "clockwise": true,
      "startFromZero": false,
      "lazy": true}),
      NgMultiSelectDropDownModule.forRoot()
    
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent],
  
})

export class AppModule { }
