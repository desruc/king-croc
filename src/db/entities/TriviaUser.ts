import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class TriviaUser {
  @PrimaryColumn()
  id: number;

  @Column()
  currentStreak: number;

  @Column()
  highestStreak: number;

  @Column()
  totalCorrectAnswers: number;
}

export default TriviaUser;
