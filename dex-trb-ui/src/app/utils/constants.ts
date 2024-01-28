export const USER_ROLES = {
    ADMIN: 'ADMIN',
    SME: 'SME'
}
export const EMPTY = {
    STRING: '',
    ARRAY: [],
    OBJECT: {},
    NULL: null,
}
export const NAVIGATION_URL_PATHS = {
    LOGIN: ['/'],
    DASHBOARD: ['auth/dashboard'],
    ADMIN_MANAGEMENT: ['auth/admin-management'],
    ALLOCATION_LIST: ['auth/allocation-list'],
    EDIT: ['auth/edit'],
    ADD_USER: ['auth/add-user'],
    OBJECTION_TRACKING: ['auth/objection-tracking'],
    OBJECTION_TRACKING_STATUS: ['auth/objection-tracking-status'],
    OBJECTION_TRACKING_APPROVAL: ['auth/objection-approval'],
    SME_REPORT :['/auth/sme-report'],
    OBJECTION_SUMMARY_REPORT : ['/auth/objection-summary-report'],
    FINAL_SUMMARY_REPORT : ['/auth/final-summary-report'],
    OBJECTION_DETAILED_REPORT : ['/auth/objection-detailed-report'],
    CHANGE_PASSWORD : ['/auth/change-password']
}
export const BOOLEAN = {
    TRUE: true,
    FALSE: false
}