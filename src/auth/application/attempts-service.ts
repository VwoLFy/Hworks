import {inject, injectable} from "inversify";
import {AttemptsRepository} from "../infrastructure/attempts-repository";
import add from "date-fns/add";
import {AttemptsDataDto} from "./dto/AttemptsDataDto";
import {AttemptsData, AttemptsDataModel} from "../domain/attempts.schema";

@injectable()
export class AttemptsService {
    constructor(@inject(AttemptsRepository) protected attemptsRepository: AttemptsRepository) {
    }

    async findAttempts(dto: AttemptsDataDto): Promise<number> {
        const fromDate = +add(new Date(), {seconds: -10})
        return this.attemptsRepository.findAttempts(dto, fromDate)
    }
    async addAttemptToList(dto: AttemptsDataDto): Promise<void> {
        const newAttempt = new AttemptsData(dto.ip, dto.url)
        const attempt = new AttemptsDataModel(newAttempt)
        await this.attemptsRepository.save(attempt)
    }
    async deleteAll() {
        await this.attemptsRepository.deleteAll()
    }
}