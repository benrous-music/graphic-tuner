import { Pitch } from "@/pitch-processing/tuning/types";

export interface PitchProps {
  pitch: Pitch,
  setPitch: React.Dispatch<React.SetStateAction<Pitch>>
}
