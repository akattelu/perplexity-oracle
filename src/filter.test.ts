import { describe, expect, test } from "bun:test";
import { StreamThinkFilter, filterThinkTags } from "./filter";

describe("StreamThinkFilter", () => {
  test("passes through normal text", () => {
    const filter = new StreamThinkFilter();
    expect(filter.process("Hello world")).toBe("Hello world");
  });

  test("filters out complete think block", () => {
    const filter = new StreamThinkFilter();
    expect(filter.process("Hello <think>thinking process</think>World")).toBe("Hello World");
  });

  test("handles split open tag", () => {
    const filter = new StreamThinkFilter();
    expect(filter.process("Hello <th")).toBe("Hello ");
    expect(filter.process("ink>content</think>")).toBe("");
  });

  test("handles split close tag", () => {
    const filter = new StreamThinkFilter();
    expect(filter.process("<think>content</th")).toBe("");
    expect(filter.process("ink>done")).toBe("done");
  });

  test("handles split content inside think", () => {
    const filter = new StreamThinkFilter();
    expect(filter.process("start <think>")).toBe("start ");
    expect(filter.process("thinking ")).toBe("");
    expect(filter.process("hard")).toBe("");
    expect(filter.process("</think> end")).toBe(" end");
  });

  test("flushes partial open tag at end if not completed", () => {
    const filter = new StreamThinkFilter();
    expect(filter.process("Hello <th")).toBe("Hello ");
    expect(filter.flush()).toBe("<th");
  });

  test("handles partial match that turns out to be false alarm", () => {
    const filter = new StreamThinkFilter();
    expect(filter.process("This is <not a tag")).toBe("This is <not a tag");
  });
  
  test("handles partial match of close tag that is false alarm", () => {
    const filter = new StreamThinkFilter();
    // <think> content </th not close > content </think>
    expect(filter.process("Start <think> content </not close> real end </think> Done")).toBe("Start  Done");
  });
});

describe("filterThinkTags", () => {
  test("removes think tags from string", () => {
    const input = "Start <think>thought process</think> End";
    expect(filterThinkTags(input)).toBe("Start  End");
  });

  test("removes multiline think tags", () => {
    const input = "Start <think>\nthought\nprocess\n</think> End";
    expect(filterThinkTags(input)).toBe("Start  End");
  });
});
