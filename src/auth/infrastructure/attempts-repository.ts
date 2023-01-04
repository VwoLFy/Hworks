import {AttemptsDataDocument, AttemptsDataModel} from "../domain/attempts.schema";
import {AttemptsDataDto} from "../application/dto/AttemptsDataDto";
import {injectable} from "inversify";

@injectable()
export class AttemptsRepository {
    async findAttempts(dto: AttemptsDataDto, fromDate: number): Promise<number> {
        const {ip, url} = dto

        let query = AttemptsDataModel.countDocuments()
            .where('ip').equals(ip)
            .where('url').equals(url)
            .where('date').gte(fromDate)
        return query.exec()
    }

    async save(attempt: AttemptsDataDocument) {
        await attempt.save()
    }

    async deleteAll() {
        await AttemptsDataModel.deleteMany({})
    }
}