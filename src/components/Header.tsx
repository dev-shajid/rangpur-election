import Link from "next/link";
import Logo from "./Logo";
import HeaderProfile from "./HeaderProfile";

const Header = () => {

    return (
        <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/80">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo & Title */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <Logo />
                        <div className="hidden sm:block">
                            <h1 className="text-lg font-semibold text-foreground">Rangpur Division</h1>
                            <p className="text-xs text-muted-foreground">Election Information Portal</p>
                        </div>
                    </Link>

                    <HeaderProfile />
                </div>
            </div>
        </header>
    );
};

export default Header;
