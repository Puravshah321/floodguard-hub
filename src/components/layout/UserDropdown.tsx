import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Settings, 
  LogOut, 
  Award, 
  ChevronDown,
  Camera,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';

interface UserDropdownProps {
  isLanding?: boolean;
}

export function UserDropdown({ isLanding = false }: UserDropdownProps) {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center gap-2">
        <Link to="/auth">
          <Button 
            variant={isLanding ? 'heroOutline' : 'ghost'} 
            size="sm"
            className={isLanding ? 'text-white border-white/30 hover:bg-white/10' : ''}
          >
            Log In
          </Button>
        </Link>
        <Link to="/auth">
          <Button 
            size="sm"
            className={isLanding 
              ? 'bg-white text-primary hover:bg-white/90' 
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
            }
          >
            Sign Up
          </Button>
        </Link>
      </div>
    );
  }

  const initials = user.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || user.email[0].toUpperCase();

  // Determine user contribution level (mock - would come from API)
  const contributionLevel = 'Silver';
  const contributionColor = {
    Bronze: 'bg-amber-600',
    Silver: 'bg-slate-400',
    Gold: 'bg-yellow-500',
    Elite: 'bg-gradient-to-r from-purple-500 to-pink-500',
  }[contributionLevel] || 'bg-slate-400';

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className={`flex items-center gap-2 px-2 h-auto py-1.5 ${
            isLanding ? 'text-white hover:bg-white/10' : 'hover:bg-secondary'
          }`}
        >
          <Avatar className="h-8 w-8 border-2 border-border">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:flex flex-col items-start">
            <span className={`text-sm font-medium ${isLanding ? 'text-white' : ''}`}>
              {user.name}
            </span>
            <span className={`text-xs ${isLanding ? 'text-white/60' : 'text-muted-foreground'}`}>
              {contributionLevel} Contributor
            </span>
          </div>
          <ChevronDown className={`w-4 h-4 ${isLanding ? 'text-white/60' : 'text-muted-foreground'}`} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 p-2">
        <DropdownMenuLabel className="p-0">
          <div className="flex items-center gap-3 p-2">
            <Avatar className="h-12 w-12 border-2 border-border">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              <Badge className={`mt-1 text-[10px] h-5 ${contributionColor} text-white border-0`}>
                {contributionLevel} Contributor
              </Badge>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link to="/profile" className="flex items-center gap-3 py-2">
            <User className="w-4 h-4 text-muted-foreground" />
            <span>Your Profile</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link to="/detection" className="flex items-center gap-3 py-2">
            <Camera className="w-4 h-4 text-muted-foreground" />
            <span>Contributions</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link to="/profile?tab=achievements" className="flex items-center gap-3 py-2">
            <Award className="w-4 h-4 text-muted-foreground" />
            <span>Achievements</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link to="/settings" className="flex items-center gap-3 py-2">
            <Settings className="w-4 h-4 text-muted-foreground" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>

        {user.role === 'admin' && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link to="/admin" className="flex items-center gap-3 py-2">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <span>Admin Panel</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={handleLogout}
          className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
        >
          <LogOut className="w-4 h-4 mr-3" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
