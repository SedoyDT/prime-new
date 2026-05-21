```plantuml
' Определение классов
class LeadDetailComponent {
    - ngModel: TFullLead
    - errors: Assoc<any>
    - options: { hideFunnel: boolean }
    - ngReadonly: boolean
    - propCategoryErrors: {}
    - files: TFileUploaderModel
    - parentFiles: TFileUploaderModel
    - initialValues: { funnelId, stageId, clientId, userId }
    - canMoveLeadFromStage: boolean

    + $onInit(): void
    + $onChanges(onChangesObj: angular.TOnChangesObject): void
    + $postLink(): void
    + setFunnelId(): void
    + saveContacts(): void
    + isClientChanged(): boolean
    + isLeadCommentRequired(): boolean
    + changeFileList(): void
    + refreshClientData(): void
    + onTagsChange(): void
    + onOwnerChange(): void
}

class DataService {
    + initStageSource(ngModel: TFullLead, stage: any, funnelId: number): void
    + getStage(stageId: number): any
    + saveContact(id: number, phones: any[]): Promise<any>
    + removeFiles(fileIds: number[]): Promise<void>
    + uploadFiles(leadId: number, files: any[]): Promise<any[]>
    + saveTags(leadId: number, tags: any[]): Promise<void>
    + assigneeSource: any
    + propSchema: any[]
}

' Определение отношений
LeadDetailComponent --> DataService : "использует для выполнения операций"
```
