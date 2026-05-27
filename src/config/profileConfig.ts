import type { ProfileConfig } from "../types/config";
import userProfile from "../data/profile.json";

export const profileConfig: ProfileConfig = {
	// 头像
	avatar: userProfile.avatar,

	// 名字
	name: userProfile.name,

	// 个人签名
	bio: userProfile.bio,

	// 链接配置
	links: userProfile.links.map((link) => ({
		...link,
		showName: link.showName ?? false,
	})),
};
