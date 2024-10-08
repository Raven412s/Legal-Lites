import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ITeam } from "@/interfaces/mongoose-models/teams";
import { teamSchema } from "@/zod-schemas/zTeam";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LawyerForm } from "../forms/LawyerForm";

// Main Team Form

