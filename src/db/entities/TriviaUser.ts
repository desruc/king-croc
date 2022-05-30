import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class TriviaUser {
  @PrimaryColumn()
  id: string;

  @Column({ default: 0 })
  currentStreak: number;

  @Column({ default: 0 })
  highestStreak: number;

  @Column({ default: 0 })
  totalCorrectAnswers: number;

  @Column({ default: 0 })
  totalAnswers: number;

  @Column({ default: false })
  answered: boolean;
}

export default TriviaUser;
