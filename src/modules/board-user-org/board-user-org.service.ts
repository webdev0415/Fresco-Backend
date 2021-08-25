import {BoardUserOrgEntity} from './board-user-org.entity';
import {Injectable} from "@nestjs/common";
import {PermissionEnum} from "../../common/constants/permission";
import {BoardUserOrgRepository} from "./board-user-org.repository";

@Injectable()
export class BoardUserOrgService {

    constructor(private readonly boardUserOrgRepository: BoardUserOrgRepository) {
    }

    public async AddCollaborator(boardId: string, orgId: string, userId: string, permission: PermissionEnum) {

        let relation = await this.boardUserOrgRepository.findOne({
            where: {
                boardId: boardId,
                orgId: orgId,
                userId: userId
            }
        })
        if (relation) {
            relation.permission = permission
            return this.boardUserOrgRepository.save(relation)
        } else {
            let model = new BoardUserOrgEntity();
            model.boardId = boardId;
            model.orgId = orgId;
            model.userId = userId;
            model.permission = permission;
            return this.boardUserOrgRepository.save(model)

        }

    }

    public async RemoveCollaborator(boardId: string, orgId: string, userId: string) {

        let relation = await this.boardUserOrgRepository.findOne({
            where: {
                boardId: boardId,
                orgId: orgId,
                userId: userId
            }
        })
        if (relation) {

            await this.boardUserOrgRepository.remove(relation)
        }

        return !!relation
    }

    public async ChangePermission(boardId: string, orgId: string, userId: string, permission: PermissionEnum) {

        let relation = await this.boardUserOrgRepository.findOne({
            where: {
                boardId: boardId,
                orgId: orgId,
                userId: userId
            }
        })
        if (relation) {
            relation.permission = permission
            return this.boardUserOrgRepository.save(relation)
        }

    }

    public  async GetAllBoards(userId:string,orgId:string){

        return  this.boardUserOrgRepository.find({
            where: {
                userId: userId,orgId:orgId
            },relations:["board","board.boards"]
        })
    }

}
