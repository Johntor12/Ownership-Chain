import {
    GithubIcon,
    InstagramIcon,
    YoutubeIcon,
    Group,
    BadgeRussianRuble
} from "lucide-react";

export function Footer() {
    return (
        <div className="background-dark text-white px-10 pt-5 pb-2">
            <div className="flex justify-between md:px-[12vw]">
                <div className="space-y-3">
                    <div className="flex items-center space-x-4">
                        <GithubIcon />
                        <p>github repo</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <InstagramIcon />
                        <p>Instagram account</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <YoutubeIcon />
                        <p>Youtube</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <BadgeRussianRuble />
                        <p>Business Logic</p>
                    </div>
                </div>
                <div className="space-y-4">
                    <p>Develpoer Team</p>
                    <div className="flex items-center space-x-3">
                        <Group />
                        <p>Alex Cinatra Hutasoit</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Group />
                        <p>Advent Sbastian Hutasoit</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Group />
                        <p>Arkananta Fijratullah</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Group />
                        <p>Joshua Adhi Chandra</p>
                    </div>
                </div>
            </div>
            <div className="mt-10 text-center">
                All Right Reserved By Findway AncientSclupture Project
            </div>
        </div>
    );
}