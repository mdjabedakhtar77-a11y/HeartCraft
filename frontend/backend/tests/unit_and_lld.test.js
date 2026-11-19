/**
 * HeartCraft In-Process Unit & LLD Design Pattern Test Suite
 * Validates SOLID Principles, Factory Pattern, and Repository Pattern in-memory.
 * Tests 100% Free & Instant Card Publishing Workflow.
 */

const assert = require('assert');
const { dbManager, getDatabase } = require('../config/database');
const Template = require('../models/Template');
const Card = require('../models/Card');
const User = require('../models/User');
const cardService = require('../services/cardService');
const qrService = require('../services/qrService');

async function runTestSuite() {
  console.log('\n======================================================');
  console.log('🧪 Running HeartCraft LLD & SOLID Test Suite (Free Workflow)');
  console.log('======================================================\n');

  // 1. Initialize Database & verify seeding
  await dbManager.initialize();
  const db = getDatabase();
  const categories = db.find('categories');
  const templates = Template.getAll();
  assert(categories.length >= 6, 'Categories must be pre-seeded');
  assert(templates.length >= 6, 'Templates must be pre-seeded');
  console.log(`✓ [LLD 1/6] Repository Pattern & DB Seeding: PASSED (${categories.length} categories, ${templates.length} templates)`);

  // 2. Test User Model & Password Hashing
  const testEmail = `test_${Date.now()}@example.com`;
  const salt = await require('bcryptjs').genSalt(10);
  const hash = await require('bcryptjs').hash('TestPassword123', salt);
  const user = User.create({ name: 'Test User', email: testEmail, password_hash: hash });
  const retrievedUser = User.findByEmail(testEmail);
  assert.strictEqual(retrievedUser.name, 'Test User');
  console.log('✓ [LLD 2/6] Single Responsibility (User Model & Auth): PASSED');

  // 3. Test Card Draft Creation & Passcode Hashing
  const draft = await cardService.createCardDraft(user.id, {
    template_id: 1,
    recipient_name: 'Ananya',
    message: 'Happy Birthday Ananya! You are amazing! ✨',
    relationship: 'Best Friend',
    passcode: '9876',
    countdown: true,
    birthday_date: '2026-11-20'
  });
  assert(draft.id, 'Draft card must have an ID');
  assert.strictEqual(draft.status, 'draft', 'Initial card status must be draft');
  assert(draft.slug, 'Card must have an unguessable slug');
  console.log(`✓ [LLD 3/6] Card Service & Draft Builder: PASSED (Draft #${draft.id}, Slug: ${draft.slug})`);

  // 4. Test Live Preview Generation (Open/Closed & DIP)
  const preview = await cardService.getCardPreview(draft.id);
  assert.strictEqual(preview.isPreview, true, 'Preview payload must be flagged isPreview=true');
  console.log('✓ [LLD 4/6] Card Preview Generator: PASSED');

  // 5. Test Direct Publishing (Free & Instant Workflow - No Payment Gate)
  const publishedCard = await cardService.publishCard(draft.id);
  assert.strictEqual(publishedCard.status, 'published', 'Card status must become published directly');
  assert(publishedCard.published_at, 'Card must have published_at timestamp');
  console.log(`✓ [LLD 5/6] Direct Instant Publishing (Free Flow): PASSED (Card #${publishedCard.id})`);

  // 6. Test Public Access, Passcode Security Gate & QR Generation
  // When locked with passcode:
  const lockedPublicCard = await cardService.getPublicCard(draft.slug);
  assert.strictEqual(lockedPublicCard.is_passcode_protected, true, 'Card must be locked behind passcode');
  assert.strictEqual(lockedPublicCard.content, undefined, 'Content must not be leaked while locked');

  // Verify Passcode
  const wrongPass = await cardService.verifyCardPasscode(draft.slug, '0000');
  assert.strictEqual(wrongPass.verified, false, 'Invalid passcode must fail');

  const rightPass = await cardService.verifyCardPasscode(draft.slug, '9876');
  assert.strictEqual(rightPass.verified, true, 'Correct passcode must succeed');
  assert(rightPass.card.content.message, 'Unlocked card reveals message');

  // QR Code
  const qrDataUrl = await qrService.generateQrDataUrl(`https://heartcraft.example/card/${draft.slug}`);
  assert(qrDataUrl.startsWith('data:image/png;base64,'), 'QR data URL valid');
  console.log('✓ [LLD 6/6] Passcode Cryptography & QR Code Service: PASSED');

  console.log('\n======================================================');
  console.log('🎉 ALL 6/6 LLD & SOLID PRINCIPLE TESTS PASSED FLAWLESSLY!');
  console.log('======================================================\n');
}

runTestSuite().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
