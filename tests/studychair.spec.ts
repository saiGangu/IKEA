import { test } from "@playwright/test";
import { Homepage } from "../pages/Homepage";
import { StudyPage } from "../pages/Studychairpage";

test.describe("@sanity Study Chair Filtering Flow", () => {
  let homepage: Homepage;
  let studypage: StudyPage;

  test.beforeEach(async ({ page }) => {
    homepage = new Homepage(page);
    studypage = new StudyPage(page);
    await homepage.navigate();
    await homepage.searchStudyChair();
  });

  test("Should open All Filters panel", async () => {
    await studypage.allFilter();
  });

  test("Should apply customer rating filter", async () => {
    await studypage.allFilter();
    await studypage.rating();
    await studypage.checkRating();
  });

  test("Should view filtered products", async () => {
    await studypage.allFilter();
    await studypage.rating();
    await studypage.checkRating();
    await studypage.viewAll();
  });

  test("Should save chair details into CSV", async () => {
    await studypage.allFilter();
    await studypage.rating();
    await studypage.checkRating();
    await studypage.viewAll();
    await studypage.chairCards();
  });
});
