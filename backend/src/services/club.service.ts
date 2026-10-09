import { clubRepository } from "../repositories/club.repository.js";

export class ClubService {
  async getClubInfo() {
    return await clubRepository.get();
  }

  async updateClubInfo(data: any) {
    return await clubRepository.update(data);
  }
}

export const clubService = new ClubService();
