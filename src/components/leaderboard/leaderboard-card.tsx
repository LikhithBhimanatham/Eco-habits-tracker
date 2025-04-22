
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export interface LeaderboardUser {
  id: number;
  name: string;
  points: number;
  avatar?: string;
  savingsPercent: number;
  rank: number;
}

interface LeaderboardCardProps {
  user: LeaderboardUser;
  maxPoints: number;
  className?: string;
}

export function LeaderboardCard({ user, maxPoints, className }: LeaderboardCardProps) {
  return (
    <Card className={`${className} hover:shadow-md transition-shadow`}>
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <div className="relative">
          <span 
            className="absolute -top-2 -left-2 bg-amber-400 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center"
          >
            {user.rank}
          </span>
          <Avatar>
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-ecoGreen/20 text-ecoGreen-dark">
              {user.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        <div>
          <CardTitle className="text-sm font-medium">{user.name}</CardTitle>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span className="font-semibold text-ecoGreen">{user.points}</span> eco points
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-xs mb-1">
          <span>Savings progress</span>
          <span className="font-medium">{user.savingsPercent}%</span>
        </div>
        <Progress value={user.savingsPercent} className="h-2 bg-ecoGreen/20 [&>div]:bg-ecoGreen" />
      </CardContent>
    </Card>
  );
}
