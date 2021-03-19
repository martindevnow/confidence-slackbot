export interface SlashCommand {
  token: string; // "TVJKqP7kmLPWWw7IPKe6pikF";
  team_id: string; // "T01SEV8TD4Y";
  team_domain: string; // "yamenai";
  channel_id: string; // "C01RN3BV3J9";
  channel_name: string; // "general";
  user_id: string; // "U01RRBXN0H1";
  user_name: string; // "the.one.martin";
  command: string; // "/enps";
  text: string; // "10";
  api_app_id: string; // "A01S3Q174RX";
  is_enterprise_install: string; // "false";
  response_url: string; // "https://hooks.slack.com/commands/T01SEV8TD4Y/1888259241761/ayAWSPSrOBriD5on0LoDYvLI";
  trigger_id: string; // "1872564539205.1898994931168.3e8173f661ac9806104fdec0c602629a";
}
// const example: SlashCommand = {
//   token: "TVJKqP7kmLPWWw7IPKe6pikF",
//   team_id: "T01SEV8TD4Y",
//   team_domain: "yamenai",
//   channel_id: "C01RN3BV3J9",
//   channel_name: "general",
//   user_id: "U01RRBXN0H1",
//   user_name: "the.one.martin",
//   command: "/enps"
//   text: "10",
//   api_app_id: "A01S3Q174RX",
//   is_enterprise_install: "false",
//   response_url:
//     "https://hooks.slack.com/commands/T01SEV8TD4Y/1888259241761/ayAWSPSrOBriD5on0LoDYvLI",
//   trigger_id: "1872564539205.1898994931168.3e8173f661ac9806104fdec0c602629a",
// };

export interface SlackChannel {
  is_shared: boolean; // false;
  creator: string; // "U01RRBXN0H1";
  is_ext_shared: boolean; // false;
  is_channel: boolean; // true;
  created: number; // 1616087599;
  is_pending_ext_shared: boolean; // false;
  name_normalized: string; // "random";
  num_members: number; // 2;
  purpose: {
    last_set: number; // 1616087599;
    creator: string; // "U01RRBXN0H1";
    value: string; // "A place for non-work-related flimflam, faffing, hodge-podge or jibber-jabber you'd prefer to keep out of more focused work-related channels.";
  };
  is_general: boolean; // false;
  topic: {
    last_set: number; // 1616087599;
    creator: string; // "U01RRBXN0H1";
    value: string; // "Non-work banter and water cooler conversation";
  };
  unlinked: number; // 0;
  shared_team_ids: Array<string>; // ["T01SEV8TD4Y"];
  is_group: boolean; // false;
  is_im: boolean; // false;
  id: string; // "C01RACCUB71";
  is_private: boolean; // false;
  previous_names: [];
  pending_connected_team_ids: Array<any>; // [];
  is_mpim: boolean; // false;
  is_member: boolean; // false;
  is_archived: boolean; // false;
  parent_conversation: null;
  name: string; // "random";
  pending_shared: Array<any>; // [];
  is_org_shared: boolean; // false;
}

// const example_channel = {
//   is_shared: false,
//   creator: "U01RRBXN0H1",
//   is_ext_shared: false,
//   is_channel: true,
//   created: 1616087599,
//   is_pending_ext_shared: false,
//   name_normalized: "random",
//   num_members: 2,
//   purpose: {
//     last_set: 1616087599,
//     creator: "U01RRBXN0H1",
//     value:
//       "A place for non-work-related flimflam, faffing, hodge-podge or jibber-jabber you'd prefer to keep out of more focused work-related channels.",
//   },
//   is_general: false,
//   topic: {
//     last_set: 1616087599,
//     creator: "U01RRBXN0H1",
//     value: "Non-work banter and water cooler conversation",
//   },
//   unlinked: 0,
//   shared_team_ids: ["T01SEV8TD4Y"],
//   is_group: false,
//   is_im: false,
//   id: "C01RACCUB71",
//   is_private: false,
//   previous_names: [],
//   pending_connected_team_ids: [],
//   is_mpim: false,
//   is_member: false,
//   is_archived: false,
//   parent_conversation: null,
//   name: "random",
//   pending_shared: [],
//   is_org_shared: false,
// };

export interface SimpleChannel {
  id: string;
  name: string;
}

export interface PostReminderMessage {
  channel?: {
    id: string;
  };
}

export interface PostResultsMessage {
  channel?: {
    id: string;
    name: string;
  };
}
